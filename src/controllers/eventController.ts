import { fetchEventData, fetchMappings } from "../services/fetchService.js";
import { upsertEvent, markRemovedEvents, getAllEvents } from "../services/eventService.js";
import { EventData, Score } from "../types/index.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { Competitor } from "@prisma/client";

let mappings: Record<string, string> = {};

export async function updateEvents() {
  mappings = await fetchMappings();
  const eventData = await fetchEventData();
  const existingIds = new Set<string>();

  for (const eventString of eventData) {
    const fields = eventString.split(",");
    const [
      eventId,
      sportId,
      competitionId,
      startTime,
      homeCompetitorId,
      awayCompetitorId,
      eventStatusId,
      scoresString,
    ] = fields;

    const event: EventData = {
      id: eventId,
      sport: mappings[sportId],
      competition: mappings[competitionId],
      startTime: new Date(parseInt(startTime)).toISOString(),
      competitors: {
        HOME: {
          type: homeCompetitorId,
          name: mappings[homeCompetitorId] ?? "Unknown",
        },
        AWAY: {
          type: awayCompetitorId,
          name: mappings[awayCompetitorId] ?? "Unknown",
        },
      },
      scores: parseScores(scoresString),
      status: mappings[eventStatusId],
    };

    await upsertEvent(event);

    existingIds.add(eventId);
  }

  await markRemovedEvents(Array.from(existingIds));
}

function parseScores(scoresString: string): { [key: string]: Score } {
  const scores: { [key: string]: Score } = {};
  if (!scoresString) return scores;

  const periods = scoresString.split("|");
  periods.forEach((period) => {
    const [periodIdWithType, score] = period.split("@");
    const [homeScore, awayScore] = score.split(":");
    const periodType = mappings[periodIdWithType] || periodIdWithType;
    scores[periodType] = {
      type: periodType,
      home: homeScore,
      away: awayScore,
    };
  });
  return scores;
}

export async function getFormattedState() {
  const events = await getAllEvents();

  return events.reduce((acc: Record<string, EventData>, event) => {
    

    acc[event.id] = {
      id: event.id,
      status: event.status,
      scores: event.scores.reduce((acc: Record<string, Score>, score: Score) => {
        acc[score.type] = score;
        return acc;
      }, {}),
      startTime: event.startTime.toISOString(),
      sport: event.sport,
      competitors: event.competitors.reduce((acc: EventData['competitors'], competitor: Competitor) => {
        acc[competitor.type] = competitor;
        return acc;
      }, {}),
      competition: event.competition,
    };
    return acc;
  }, {} as Record<string, EventData>);
}

export const stateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await updateEvents();
    const formattedState = await getFormattedState();
    reply.send(formattedState);
  } catch (error) {
    console.error("Error handling state:", error);
    reply.status(500).send({ error: "Failed to retrieve state" });
  }
};