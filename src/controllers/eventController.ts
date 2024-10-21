import { fetchEventData } from '../services/fetchService.js';
import { upsertEvent, markRemovedEvents, getAllEvents } from '../services/eventService.js';
import { EventData } from '../types/index.js';

export async function updateEvents() {
  const eventData = await fetchEventData() as EventData;
  const existingIds = Object.keys(eventData);

  for (const id of existingIds) {
    await upsertEvent(eventData[id]);
  }

  await markRemovedEvents(existingIds);
}

export async function getFormattedState() {
  const events = await getAllEvents();

  return events.reduce((acc: Record<string, EventData[keyof EventData]>, event) => {
    acc[event.id] = {
      id: event.id,
      status: event.status,
      scores: {
        CURRENT: {
          type: event.scores[0].type,
          home: event.scores[0].home,
          away: event.scores[0].away,
        },
      },
      startTime: event.startTime.toISOString(),
      sport: event.sport,
      competitors: {
        HOME: {
          type: event.competitors[0].type,
          name: event.competitors[0].name,
        },
        AWAY: {
          type: event.competitors[1].type,
          name: event.competitors[1].name,
        },
      },
      competition: event.competition,
    };
    return acc;
  }, {});
}