import { PrismaPetsRepository } from '../../repositories/prisma/prisma-pets-repository'
import { GetPetDetailsUseCase } from '../get-pet-details'

export function makeGetPetDetailsUseCase() {
  const petsRepository = new PrismaPetsRepository()
  return new GetPetDetailsUseCase(petsRepository)
}
