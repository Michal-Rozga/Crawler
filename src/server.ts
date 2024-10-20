import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

fastify.register(cors);
fastify.register(helmet);
fastify.register(require('fastify-formbody'));

fastify.get('/health', async (request, reply) => {
  return { status: 'OK' };
});

fastify.get('/state', async (request, reply) => {
  const response = await fetchStateData();
  reply.send(response);
});

const start = async () => {
    try {
      const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
      await fastify.listen({ port, host: '0.0.0.0' });
      fastify.log.info(`Server running at http://localhost:${port}`);
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
};

start();

async function fetchStateData() {

  // For now, return a mock response:
  return {
    "3eccf850-571f-4e18-8cb3-2c9e3afade7b": {
      id: "3eccf850-571f-4e18-8cb3-2c9e3afade7b",
      status: "LIVE",
      scores: {
        CURRENT: {
          type: "CURRENT",
          home: "0",
          away: "0"
        }
      },
      startTime: "2024-03-04T10:36:07.812Z",
      sport: "FOOTBALL",
      competitors: {
        HOME: {
          type: "HOME",
          name: "Juventus"
        },
        AWAY: {
          type: "AWAY",
          name: "Paris Saint-Germain"
        }
      },
      competition: "UEFA Champions League"
    }
  };
}
