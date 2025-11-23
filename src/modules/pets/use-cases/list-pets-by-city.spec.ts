import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgsRepository } from '../../orgs/repositories/in-memory/in-memory-orgs-repository'
import { InMemoryPetsRepository } from '../repositories/in-memory/in-memory-pets-repository'
import { RegisterOrgUseCase } from '../../orgs/use-cases/register-org'
import { RegisterPetUseCase } from './register-pet'
import { ListPetsByCityUseCase } from './list-pets-by-city'

let orgsRepository: InMemoryOrgsRepository
let petsRepository: InMemoryPetsRepository
let registerOrg: RegisterOrgUseCase
let registerPet: RegisterPetUseCase
let sut: ListPetsByCityUseCase

describe('ListPetsByCityUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    petsRepository = new InMemoryPetsRepository(orgsRepository)
    registerOrg = new RegisterOrgUseCase(orgsRepository)
    registerPet = new RegisterPetUseCase(petsRepository, orgsRepository)
    sut = new ListPetsByCityUseCase(petsRepository)
  })

  it('should list pets filtered by city', async () => {
    const { org } = await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    await registerPet.execute({
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
      requirements: [],
      photos: [],
    })

    await registerPet.execute({
      orgId: org.id,
      name: 'Bidu',
      species: 'dog',
      description: 'Playful dog',
      city: 'São Paulo',
      age: 'PUPPY',
      size: 'SMALL',
      energyLevel: 'HIGH',
      independenceLevel: 'HIGH',
      environment: 'LARGE',
      requirements: [],
      photos: [],
    })

    const { pets } = await sut.execute({
      city: 'Porto Alegre',
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toBe('Lucky')
  })

  it('should apply optional filters', async () => {
    const { org } = await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    await registerPet.execute({
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
      requirements: [],
      photos: [],
    })

    await registerPet.execute({
      orgId: org.id,
      name: 'Thor',
      species: 'dog',
      description: 'Calm dog',
      city: 'Porto Alegre',
      age: 'SENIOR',
      size: 'SMALL',
      energyLevel: 'LOW',
      independenceLevel: 'HIGH',
      environment: 'LARGE',
      requirements: [],
      photos: [],
    })

    const { pets } = await sut.execute({
      city: 'Porto Alegre',
      filters: {
        age: 'SENIOR',
        size: 'SMALL',
        energy_level: 'LOW',
      },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toBe('Thor')
  })

  it('should paginate results', async () => {
    const { org } = await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    for (let i = 0; i < 25; i++) {
      await registerPet.execute({
        orgId: org.id,
        name: `Pet-${i}`,
        species: 'dog',
        description: 'Friendly dog',
        city: 'Porto Alegre',
        age: 'ADULT',
        size: 'MEDIUM',
        energyLevel: 'MEDIUM',
        independenceLevel: 'MEDIUM',
        environment: 'SMALL',
        requirements: [],
        photos: [],
      })
    }

    const { pets } = await sut.execute({
      city: 'Porto Alegre',
      pagination: {
        page: 2,
        pageSize: 10,
      },
    })

    expect(pets).toHaveLength(10)
  })

  it('should order pets by newest first when paginating', async () => {
    const { org } = await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    const firstPet = await registerPet.execute({
      orgId: org.id,
      name: 'Older Pet',
      species: 'dog',
      description: 'Friendly dog',
      city: 'Porto Alegre',
      age: 'ADULT',
      size: 'MEDIUM',
      energyLevel: 'MEDIUM',
      independenceLevel: 'MEDIUM',
      environment: 'SMALL',
      requirements: [],
      photos: [],
    })

    const secondPet = await registerPet.execute({
      orgId: org.id,
      name: 'Newest Pet',
      species: 'dog',
      description: 'Playful dog',
      city: 'Porto Alegre',
      age: 'PUPPY',
      size: 'SMALL',
      energyLevel: 'HIGH',
      independenceLevel: 'HIGH',
      environment: 'LARGE',
      requirements: [],
      photos: [],
    })

    const firstPetCreatedAt = new Date('2023-01-01T00:00:00.000Z')
    const secondPetCreatedAt = new Date('2024-01-01T00:00:00.000Z')

    const firstPetIndex = petsRepository.items.findIndex(
      (pet) => pet.id === firstPet.pet.id,
    )
    const secondPetIndex = petsRepository.items.findIndex(
      (pet) => pet.id === secondPet.pet.id,
    )

    petsRepository.items[firstPetIndex].created_at = firstPetCreatedAt
    petsRepository.items[secondPetIndex].created_at = secondPetCreatedAt

    const { pets } = await sut.execute({
      city: 'Porto Alegre',
      pagination: { page: 1, pageSize: 1 },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0].name).toBe('Newest Pet')
  })
})
