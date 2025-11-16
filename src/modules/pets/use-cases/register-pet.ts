import { Pet } from '@prisma/client'

import { OrgsRepository } from '../../orgs/repositories/orgs-repository'
import { ResourceNotFoundError } from '../../../shared/errors/resource-not-found-error'
import { PetsRepository } from '../repositories/pets-repository'

export interface RegisterPetUseCaseRequest {
  orgId: string
  name: string
  species: string
  description: string
  city: string
  age: string
  size: string
  energyLevel: string
  independenceLevel: string
  environment: string
  requirements: string[]
  photos: string[]
}

interface RegisterPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(
    private petsRepository: PetsRepository,
    private orgsRepository: OrgsRepository,
  ) {}

  async execute({
    orgId,
    name,
    species,
    description,
    city,
    age,
    size,
    energyLevel,
    independenceLevel,
    environment,
    requirements,
    photos,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const org = await this.orgsRepository.findById(orgId)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      species,
      description,
      city,
      age,
      size,
      energy_level: energyLevel,
      independence_level: independenceLevel,
      environment,
      requirements,
      photos,
      org: {
        connect: {
          id: org.id,
        },
      },
    })

    return { pet }
  }
}
