import fetch from 'node-fetch';
import { API_URL } from '../utils/apiClient.js';

export async function fetchEventData() {
  const response = await fetch(`${API_URL}/api/state`);
  if (!response.ok) {
    throw new Error('Failed to fetch event data');
  }
  return await response.json();
}

export async function fetchMappings() {
  const response = await fetch(`${API_URL}/api/mappings`);
  if (!response.ok) {
    throw new Error('Failed to fetch mappings');
  }
  return await response.json();
}