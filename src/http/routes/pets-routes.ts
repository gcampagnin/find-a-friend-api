import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { verifyJWT } from '../middlewares/verify-jwt'
import { makeRegisterPetUseCase } from '../../modules/pets/use-cases/factories/make-register-pet-use-case'
import { makeListPetsByCityUseCase } from '../../modules/pets/use-cases/factories/make-list-pets-by-city-use-case'
import { makeGetPetDetailsUseCase } from '../../modules/pets/use-cases/factories/make-get-pet-details-use-case'
import { ResourceNotFoundError } from '../../shared/errors/resource-not-found-error'

export async function petsRoutes(app: FastifyInstance) {
  app.post(
    '/pets',
    {
      preHandler: [verifyJWT],
    },
    async (request, reply) => {
      const registerPetBodySchema = z.object({
        name: z.string().min(1),
        species: z.string().min(1),
        description: z.string().min(1),
        city: z.string().min(1),
        age: z.string().min(1),
        size: z.string().min(1),
        energyLevel: z.string().min(1),
        independenceLevel: z.string().min(1),
        environment: z.string().min(1),
        requirements: z.array(z.string()).default([]),
        photos: z.array(z.string()).default([]),
      })

      const body = registerPetBodySchema.parse(request.body)

      const registerPetUseCase = makeRegisterPetUseCase()

      const { pet } = await registerPetUseCase.execute({
        orgId: request.user.sub,
        ...body,
      })

      return reply.status(201).send({
        petId: pet.id,
      })
    },
  )

  app.get('/pets', async (request) => {
    const listPetsQuerySchema = z.object({
      city: z.string().min(1),
      age: z.string().optional(),
      size: z.string().optional(),
      energy_level: z.string().optional(),
      independence_level: z.string().optional(),
      environment: z.string().optional(),
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().positive().max(50).default(20),
    })

    const query = listPetsQuerySchema.parse(request.query)

    const listPetsUseCase = makeListPetsByCityUseCase()

    const { pets } = await listPetsUseCase.execute({
      city: query.city,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
      },
      filters: {
        age: query.age,
        size: query.size,
        energy_level: query.energy_level,
        independence_level: query.independence_level,
        environment: query.environment,
      },
    })

    return {
      pets: pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        species: pet.species,
        description: pet.description,
        city: pet.city,
        age: pet.age,
        size: pet.size,
        energy_level: pet.energy_level,
        independence_level: pet.independence_level,
        environment: pet.environment,
        requirements: pet.requirements as string[],
        photos: pet.photos as string[],
        org: {
          id: pet.org.id,
          name: pet.org.name,
          whatsapp: pet.org.whatsapp,
        },
      })),
    }
  })

  app.get('/pets/:id', async (request, reply) => {
    const getPetParamsSchema = z.object({
      id: z.string().cuid(),
    })

    const { id } = getPetParamsSchema.parse(request.params)

    try {
      const getPetDetailsUseCase = makeGetPetDetailsUseCase()

      const { pet } = await getPetDetailsUseCase.execute({
        petId: id,
      })

      return {
        pet: {
          id: pet.id,
          name: pet.name,
          species: pet.species,
          description: pet.description,
          city: pet.city,
          age: pet.age,
          size: pet.size,
          energy_level: pet.energy_level,
          independence_level: pet.independence_level,
          environment: pet.environment,
          requirements: pet.requirements as string[],
          photos: pet.photos as string[],
          contact: {
            org_id: pet.org.id,
            org_name: pet.org.name,
            whatsapp: pet.org.whatsapp,
          },
        },
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return reply.status(404).send({ message: error.message })
      }

      throw error
    }
  })
}
