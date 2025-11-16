import { PrismaOrgsRepository } from '../../../orgs/repositories/prisma/prisma-orgs-repository'
import { PrismaPetsRepository } from '../../repositories/prisma/prisma-pets-repository'
import { RegisterPetUseCase } from '../register-pet'

export function makeRegisterPetUseCase() {
  const petsRepository = new PrismaPetsRepository()
  const orgsRepository = new PrismaOrgsRepository()

  return new RegisterPetUseCase(petsRepository, orgsRepository)
}
