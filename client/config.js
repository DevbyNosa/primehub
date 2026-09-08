const configuredApiUrl = import.meta.env.VITE_API_URL || '';

export const API_URL = configuredApiUrl.replace(/\/$/, '');

export const apiUrl = (path) => `${API_URL}${path}`;
