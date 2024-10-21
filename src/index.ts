import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';
import { stateHandler, updateEvents } from './controllers/eventController.js';

dotenv.config();
const fastify = Fastify({ logger: true });

fastify.register(cors);
fastify.register(helmet);

fastify.get('/state', stateHandler);

fastify.get('/health', async (request, reply) => {
    return { status: 'OK' };
});

const wait = (period: number = 5000) => new Promise(resolve => setTimeout(resolve, period));

const start = async () => {
    try {
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
        await fastify.listen({ port, host: '0.0.0.0' });
        fastify.log.info(`Server running at http://localhost:${port}`);

        await startContinuousCrawler();
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

        await wait(5000);
    }
}

start();