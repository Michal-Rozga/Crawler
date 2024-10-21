import { EventData, MappingsData } from "../types/index.js";

export const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function fetchEventData(): Promise<EventData> {
  const response = await fetch(`${API_URL}/api/state`);
  if (!response.ok) {
    throw new Error('Failed to fetch event data');
  }
  return await response.json();
}

export async function fetchMappings(): Promise<MappingsData> {
  const response = await fetch(`${API_URL}/api/mappings`);
  if (!response.ok) {
    throw new Error('Failed to fetch mappings');
  }
  return await response.json();
}