import {Hono} from 'hono'
import {handle} from 'hono/vercel'
import {cors} from 'hono/cors'
import images from './images'
import ai from './ai'
// Edge runtime enables deploying to edge computing environments,
// offering lower latency and faster response times by running
// code closer to the user's geographic location
export const runtime = 'nodejs'; // OR "edge"

const app = new Hono().basePath('/api');


app.route('/images', images).
  route('/ai', ai)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

export type AppType = typeof app;
