import { PrismaPetsRepository } from '../../repositories/prisma/prisma-pets-repository'
import { ListPetsByCityUseCase } from '../list-pets-by-city'

export function makeListPetsByCityUseCase() {
  const petsRepository = new PrismaPetsRepository()
  return new ListPetsByCityUseCase(petsRepository)
}
