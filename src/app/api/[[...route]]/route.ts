import {Context, Hono} from 'hono'
import {handle} from 'hono/vercel'
import images from './images'
import ai from './ai'
import users from './users'
import  projects  from './projects'
import { AuthConfig, initAuthConfig } from '@hono/auth-js'
import authConfig from '@/auth.config'
// Edge runtime enables deploying to edge computing environments,
// offering lower latency and faster response times by running
// code closer to the user's geographic location
export const runtime = 'nodejs'; // OR "edge"
function getAuthConfig(c: Context): AuthConfig {
return {
  secret: c.env?.AUTH_SECRET || process.env.AUTH_SECRET,
  ...authConfig as any
}
}
const app = new Hono().basePath('/api');
app.use('*', initAuthConfig(getAuthConfig));

app.route('/images', images).
  route('/ai', ai).
  route('/projects', projects).
  route('/users' , users)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

export type AppType = typeof app;
