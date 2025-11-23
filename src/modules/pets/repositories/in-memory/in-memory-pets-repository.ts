import { randomUUID } from 'node:crypto'

import { Org, Pet, Prisma } from '@prisma/client'

import {
  PaginationParams,
  PetFilters,
  PetWithOrg,
  PetsRepository,
} from '../pets-repository'
import { OrgsRepository } from '../../../orgs/repositories/orgs-repository'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  constructor(private orgsRepository: OrgsRepository) {}

  async create(data: Prisma.PetCreateInput) {
    if (!data.org?.connect?.id) {
      throw new Error('Org reference is required')
    }

    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      species: data.species,
      description: data.description,
      city: data.city,
      age: data.age,
      size: data.size,
      energy_level: data.energy_level,
      independence_level: data.independence_level,
      environment: data.environment,
      requirements: (data.requirements ?? []) as Prisma.JsonValue,
      photos: (data.photos ?? []) as Prisma.JsonValue,
      org_id: data.org.connect.id,
      created_at: new Date(),
    }

    this.items.push(pet)

    return pet
  }

  async findById(id: string): Promise<PetWithOrg | null> {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    const org = await this.orgsRepository.findById(pet.org_id)

    if (!org) {
      return null
    }

    return {
      ...pet,
      org: org as Org,
    }
  }

  async findManyByCity(
    city: string,
    filters: PetFilters,
    pagination: PaginationParams = {},
  ): Promise<PetWithOrg[]> {
    const { page = 1, pageSize = 20 } = pagination

    const filtered = this.items.filter((pet) => {
      if (pet.city !== city) return false
      if (filters.age && pet.age !== filters.age) return false
      if (filters.size && pet.size !== filters.size) return false
      if (filters.energy_level && pet.energy_level !== filters.energy_level)
        return false
      if (
        filters.independence_level &&
        pet.independence_level !== filters.independence_level
      )
        return false
      if (filters.environment && pet.environment !== filters.environment)
        return false

      return true
    })

    const paginated = filtered
      .sort(
        (petA, petB) => petB.created_at.getTime() - petA.created_at.getTime(),
      )
      .slice((page - 1) * pageSize, page * pageSize)

    const petsWithOrg: PetWithOrg[] = []

    for (const pet of paginated) {
      const org = await this.orgsRepository.findById(pet.org_id)

      if (!org) {
        continue
      }

      petsWithOrg.push({
        ...pet,
        org: org as Org,
      })
    }

    return petsWithOrg
  }
}
