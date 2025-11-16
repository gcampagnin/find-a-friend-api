import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import { env } from '../env'
import { orgsRoutes } from './routes/orgs-routes'
import { petsRoutes } from './routes/pets-routes'

export function buildApp() {
  const app = Fastify()

  app.register(cors)
  app.register(jwt, {
    secret: env.JWT_SECRET,
  })

  app.register(orgsRoutes)
  app.register(petsRoutes)

  return app
}
