import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgsRepository } from '../../orgs/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { RegisterOrgUseCase } from '../../orgs/use-cases/register-org'
import { RegisterPetUseCase } from './register-pet'
import { GetPetDetailsUseCase } from './get-pet-details'
import { ResourceNotFoundError } from '../../../shared/errors/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let registerOrg: RegisterOrgUseCase
let registerPet: RegisterPetUseCase
let sut: GetPetDetailsUseCase

describe('GetPetDetailsUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    registerOrg = new RegisterOrgUseCase(orgsRepository)
    registerPet = new RegisterPetUseCase(petsRepository, orgsRepository)
    sut = new GetPetDetailsUseCase(petsRepository)
  })

  it('should return the pet details with org contact', async () => {
    const { org } = await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    const { pet } = await registerPet.execute({
      orgId: org.id,
      name: 'Lucky',
      species: 'dog',
      description: 'Friendly dog',
      city: 'Porto Alegre',
      age: 'ADULT',
      size: 'MEDIUM',
      energyLevel: 'HIGH',
      independenceLevel: 'LOW',
      environment: 'SMALL',
      requirements: ['Vaccinated'],
      photos: ['https://example.com/photo.png'],
    })

    const result = await sut.execute({
      petId: pet.id,
    })

    expect(result.pet.org.whatsapp).toBe('555199999999')
  })

  it('should throw when pet does not exist', async () => {
    await expect(
      sut.execute({
        petId: 'unknown',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
