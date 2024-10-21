import { fetchEventData } from '../services/fetchService.js';
import { upsertEvent, markRemovedEvents, getAllEvents } from '../services/eventService.js';
import { EventData } from '../types/index.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function updateEvents() {
    const eventDataArray = await fetchEventData();
    const existingIds = eventDataArray.map(event => event.id);

    for (const event of eventDataArray) {
        await upsertEvent(event);
    }

    await markRemovedEvents(existingIds);
}

export async function getFormattedState() {
    const events = await getAllEvents();

    return events.reduce((acc: Record<string, EventData>, event) => {
        acc[event.id] = {
            id: event.id,
            status: event.status,
            scores: {
                CURRENT: {
                    type: event.scores.CURRENT.type,
                    home: event.scores.CURRENT.home,
                    away: event.scores.CURRENT.away,
                },
            },
            startTime: event.startTime.toISOString(),
            sport: event.sport,
            competitors: {
                HOME: {
                    type: event.competitors.HOME.type,
                    name: event.competitors.HOME.name,
                },
                AWAY: {
                    type: event.competitors.AWAY.type,
                    name: event.competitors.AWAY.name,
                },
            },
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
      console.error('Error handling state:', error);
      reply.status(500).send({ error: 'Failed to retrieve state' });
  }
};