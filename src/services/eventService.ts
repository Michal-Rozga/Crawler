import { PrismaClient, Prisma } from '@prisma/client';
import { EventData } from '../types/index.js';

const prisma = new PrismaClient();

export async function upsertEvent(event: EventData[keyof EventData]) {
  const { id, status, startTime, sport, competition, scores, competitors } = event;
  
  await prisma.event.upsert({
    where: { id },
    update: {
      status,
      startTime: new Date(startTime),
      sport,
      competition,
      removed: false,
      scores: {
        deleteMany: {},
        create: {
          type: scores.CURRENT.type,
          home: scores.CURRENT.home,
          away: scores.CURRENT.away,
        }
      },
      competitors: {
        deleteMany: {},
        create: [
          {
            type: competitors.HOME.type,
            name: competitors.HOME.name,
          },
          {
            type: competitors.AWAY.type,
            name: competitors.AWAY.name,
          }
        ]
      }
    },
    create: {
      id,
      status,
      startTime: new Date(startTime),
      sport,
      competition,
      removed: false,
      scores: {
        create: {
          type: scores.CURRENT.type,
          home: scores.CURRENT.home,
          away: scores.CURRENT.away,
        }
      },
      competitors: {
        create: [
          {
            type: competitors.HOME.type,
            name: competitors.HOME.name,
          },
          {
            type: competitors.AWAY.type,
            name: competitors.AWAY.name,
          }
        ]
      }
    }
  });
}

export async function markRemovedEvents(existingIds: string[]) {
  await prisma.event.updateMany({
    where: {
      id: { notIn: existingIds }
    },
    data: { removed: true }
  });
}

export async function getAllEvents(): Promise<Prisma.EventGetPayload<{ include: { scores: true, competitors: true } }>[]> {
  return await prisma.event.findMany({
    where: { removed: false },
    include: {
      scores: true,
      competitors: true
    }
  });
}