import { Pet, Prisma } from '@prisma/client'

export type PetWithOrg = Prisma.PetGetPayload<{ include: { org: true } }>

export interface PetFilters {
  age?: string
  size?: string
  energy_level?: string
  independence_level?: string
  environment?: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface PetsRepository {
  create(data: Prisma.PetCreateInput): Promise<Pet>
  findById(id: string): Promise<PetWithOrg | null>
  findManyByCity(
    city: string,
    filters: PetFilters,
    pagination?: PaginationParams,
  ): Promise<PetWithOrg[]>
}
