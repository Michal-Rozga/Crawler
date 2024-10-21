import { FastifyInstance } from "fastify";
import { updateEvents, getFormattedState } from "../controllers/eventController.js";
import fetch from 'node-fetch';
import { API_URL } from "../utils/apiClient.js";

export async function stateRoutes(fastify: FastifyInstance) {
  fastify.get('/state', async (_, reply) => {
    await updateEvents();
    const formattedState = await getFormattedState();
    reply.send(formattedState);
  });

  async function fetchStateDate() {
    try {
      const response = await fetch(`${API_URL}/state`);
      if (!response.ok) {
        throw new Error('Failed to fetch state data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching state data:', error);
      throw new Error('Failed to fetch state data');
    }
  }
}