import { EventData, MappingsData } from "../types/index.js";

export const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function fetchEventData(): Promise<EventData> {
  const response = await fetch(`${API_URL}/api/state`);
  if (!response.ok) {
    console.error(`Failed to fetch event data: ${response.status} ${response.statusText}`);
    throw new Error('Failed to fetch event data');
  }

  const data: EventData = await response.json();
  return data;
}

export async function fetchMappings(): Promise<MappingsData> {
  const response = await fetch(`${API_URL}/api/mappings`);
  if (!response.ok) {
    console.error(`Failed to fetch mappings: ${response.status} ${response.statusText}`);
    throw new Error('Failed to fetch mappings');
  }

  const data: { mappings: string } = await response.json();
  const mappingsObj: Record<string, string> = data.mappings.split(';').reduce((acc, mapping) => {
    const [id, value] = mapping.split(':');
    acc[id] = value;
    return acc;
  }, {} as Record<string, string>);

  return { mappings: mappingsObj };
}
