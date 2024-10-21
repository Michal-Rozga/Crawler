import { Prisma, PrismaClient } from "@prisma/client";
import { EventData } from '../types/index.js';

const prisma = new PrismaClient();

export async function upsertEvent(event: EventData) {
  const { id, status, startTime, sport, competition, scores, competitors } = event;

  const eventDto = {
    id,
    status,
    startTime: new Date(startTime),
    sport,
    competition,
    removed: status === "REMOVED" ? true : false,
    competitors: {
      create: [
        {
          type: competitors.HOME.type,
          name: competitors.HOME.name,
        },
        {
          type: competitors.AWAY.type,
          name: competitors.AWAY.name,
        },
      ],
    },
  };

  const existingEvent = await prisma.event.upsert({
    where: { id },
    update: eventDto,
    create: eventDto,
  });

  await prisma.score.createMany({
    data: Object.entries(scores).map(([type, score]) => ({
      eventId: existingEvent.id,
      type,
      home: score.home,
      away: score.away,
    })),
  });
}

export async function markRemovedEvents(existingIds: string[]) {
  await prisma.event.updateMany({
    where: {
      id: { notIn: existingIds }
    },
    data: { status: 'REMOVED' }
  });
}

export async function getAllEvents(): Promise<Prisma.EventGetPayload<{ include: { scores: true, competitors: true } }>[]> {
  return await prisma.event.findMany({
    where: { status: { not: 'REMOVED' } },
    include: {
      scores: true,
      competitors: true
    }
  });
}