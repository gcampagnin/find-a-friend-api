import { Prisma } from '@prisma/client'

import { prisma } from '../../../../lib/prisma'
import {
  PaginationParams,
  PetFilters,
  PetsRepository,
} from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetCreateInput) {
    return prisma.pet.create({ data })
  }

  async findById(id: string) {
    return prisma.pet.findUnique({
      where: { id },
      include: {
        org: true,
      },
    })
  }

  async findManyByCity(
    city: string,
    filters: PetFilters,
    pagination: PaginationParams = {},
  ) {
    const { page = 1, pageSize = 20 } = pagination

    const where: Prisma.PetWhereInput = {
      city,
    }

    if (filters.age) {
      where.age = filters.age
    }

    if (filters.size) {
      where.size = filters.size
    }

    if (filters.energy_level) {
      where.energy_level = filters.energy_level
    }

    if (filters.independence_level) {
      where.independence_level = filters.independence_level
    }

    if (filters.environment) {
      where.environment = filters.environment
    }

    return prisma.pet.findMany({
      where,
      orderBy: {
        created_at: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        org: true,
      },
    })
  }
}
