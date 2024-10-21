import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { stateRoutes } from './routes/state.js';
import { updateEvents } from './controllers/eventController.js';

dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

fastify.register(cors);
fastify.register(helmet);
fastify.register(require('fastify-formbody'));
fastify.register(stateRoutes);

fastify.get('/health', async (request, reply) => {
  return { status: 'OK' };
});

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server running at http://localhost:${port}`);

    startContinuousCrawler();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

async function startContinuousCrawler() {
  while (true) {
    try {
      await updateEvents();
      fastify.log.info('Event data updated');
    } catch (error) {
      fastify.log.error('Error updating event data:', error);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

start();