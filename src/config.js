export const API_ORIGIN = 'https://cis.kku.ac.th';
export const CLASSROOM_BASE = '/api/classroom';

export function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return url;
}

