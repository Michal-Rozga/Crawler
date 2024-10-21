import { fetchEventData } from '../services/fetchService.js';
import { upsertEvent, markRemovedEvents, getAllEvents } from '../services/eventService.js';
import { EventData, Score } from '../types/index.js';
import { FastifyReply, FastifyRequest } from 'fastify';

function parseScores(type: string, home: string, away: string): Score {
    return {
        type: type.trim(),
        home: home,
        away: away,
    };
}

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
        const currentScore = event.scores.length > 0 
            ? event.scores[event.scores.length - 1] 
            : { home: "0", away: "0", type: "UNKNOWN" };

        const currentScores = parseScores(currentScore.type, currentScore.home, currentScore.away);

        const homeCompetitor = event.competitors.find(c => c.type === 'HOME') || { name: 'Unknown Home', type: 'UNKNOWN' };
        const awayCompetitor = event.competitors.find(c => c.type === 'AWAY') || { name: 'Unknown Away', type: 'UNKNOWN' };

        acc[event.id] = {
            id: event.id,
            status: event.status,
            scores: {
                CURRENT: currentScores,
            },
            startTime: event.startTime.toISOString(),
            sport: event.sport,
            competitors: {
                HOME: {
                    type: homeCompetitor.type,
                    name: homeCompetitor.name,
                },
                AWAY: {
                    type: awayCompetitor.type,
                    name: awayCompetitor.name,
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