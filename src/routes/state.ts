import { FastifyInstance } from 'fastify';
import { updateEvents, getFormattedState } from '../controllers/eventController.js';

export async function stateRoutes(fastify: FastifyInstance) {
  fastify.get('/state', async (_, reply) => {
    await updateEvents();
    const formattedState = await getFormattedState();
    reply.send(formattedState);
  });
}