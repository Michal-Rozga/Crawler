import Fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

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

async function fetchStateData() {
  try {
    const apiUrl = process.env.API_URL;
    const response = await fetch(`${apiUrl}/state`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching state data:', error);
    throw new Error('Failed to fetch state data');
  }
}

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