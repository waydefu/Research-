import type { APIRoute } from 'astro';
import { graph } from '../lib/catalog.mjs';
export const GET: APIRoute = () => new Response(JSON.stringify(graph()), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' }
});
