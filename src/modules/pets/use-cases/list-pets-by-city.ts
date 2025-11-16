import {
  PaginationParams,
  PetFilters,
  PetWithOrg,
  PetsRepository,
} from '../repositories/pets-repository'

export interface ListPetsByCityUseCaseRequest {
  city: string
  filters?: PetFilters
  pagination?: PaginationParams
}

interface ListPetsByCityUseCaseResponse {
  pets: PetWithOrg[]
}

export class ListPetsByCityUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    city,
    filters = {},
    pagination,
  }: ListPetsByCityUseCaseRequest): Promise<ListPetsByCityUseCaseResponse> {
    const pets = await this.petsRepository.findManyByCity(
      city,
      filters,
      pagination,
    )

    return { pets }
  }
}
