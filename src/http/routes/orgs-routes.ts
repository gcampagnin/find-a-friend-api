import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { OrgAlreadyExistsError } from '../../modules/orgs/errors/org-already-exists-error'
import { InvalidCredentialsError } from '../../modules/orgs/errors/invalid-credentials-error'
import { makeRegisterOrgUseCase } from '../../modules/orgs/use-cases/factories/make-register-org-use-case'
import { makeAuthenticateOrgUseCase } from '../../modules/orgs/use-cases/factories/make-authenticate-org-use-case'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', async (request, reply) => {
    const registerBodySchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
      address: z.string().min(1),
      cep: z.string().min(1),
      whatsapp: z.string().min(1),
    })

    const body = registerBodySchema.parse(request.body)

    try {
      const registerOrgUseCase = makeRegisterOrgUseCase()

      await registerOrgUseCase.execute(body)

      return reply.status(201).send()
    } catch (error) {
      if (error instanceof OrgAlreadyExistsError) {
        return reply.status(409).send({ message: error.message })
      }

      throw error
    }
  })

  app.post('/sessions', async (request, reply) => {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(request.body)

    try {
      const authenticateOrgUseCase = makeAuthenticateOrgUseCase()

      const { org } = await authenticateOrgUseCase.execute({
        email,
        password,
      })

      const token = await reply.jwtSign(
        {
          orgId: org.id,
        },
        {
          sign: {
            sub: org.id,
          },
        },
      )

      return reply.status(200).send({
        token,
        org: {
          id: org.id,
          name: org.name,
          email: org.email,
          whatsapp: org.whatsapp,
        },
      })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ message: error.message })
      }

      throw error
    }
  })
}
