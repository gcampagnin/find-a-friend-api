import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryOrgsRepository } from '../../orgs/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { RegisterOrgUseCase } from '../../orgs/use-cases/register-org'
import { RegisterPetUseCase } from './register-pet'
import { ResourceNotFoundError } from '../../../shared/errors/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let registerOrg: RegisterOrgUseCase
let sut: RegisterPetUseCase

describe('RegisterPetUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    registerOrg = new RegisterOrgUseCase(orgsRepository)
    sut = new RegisterPetUseCase(petsRepository, orgsRepository)
  })

  it('should be able to register a pet for an existing org', async () => {
    const { org } = await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    const { pet } = await sut.execute({
      orgId: org.id,
      name: 'Lucky',
      species: 'dog',
      description: 'Friendly dog',
      city: 'Porto Alegre',
      age: 'ADULT',
      size: 'MEDIUM',
      energyLevel: 'HIGH',
      independenceLevel: 'MEDIUM',
      environment: 'SMALL',
      requirements: ['Vaccinated'],
      photos: ['https://example.com/photo.png'],
    })

    expect(pet.id).toEqual(expect.any(String))
    expect(petsRepository.items).toHaveLength(1)
  })

  it('should not register a pet for a non existing org', async () => {
    await expect(
      sut.execute({
        orgId: 'non-existing',
        name: 'Lucky',
        species: 'dog',
        description: 'Friendly dog',
        city: 'Porto Alegre',
        age: 'ADULT',
        size: 'MEDIUM',
        energyLevel: 'HIGH',
        independenceLevel: 'MEDIUM',
        environment: 'SMALL',
        requirements: [],
        photos: [],
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
