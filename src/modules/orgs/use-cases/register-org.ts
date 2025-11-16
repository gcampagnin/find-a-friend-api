import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'

import { OrgsRepository } from '../repositories/orgs-repository'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'

export interface RegisterOrgUseCaseRequest {
  name: string
  email: string
  password: string
  address: string
  cep: string
  whatsapp: string
}

interface RegisterOrgUseCaseResponse {
  org: Org
}

export class RegisterOrgUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    name,
    email,
    password,
    address,
    cep,
    whatsapp,
  }: RegisterOrgUseCaseRequest): Promise<RegisterOrgUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const passwordHash = await hash(password, 8)

    const org = await this.orgsRepository.create({
      name,
      email,
      password_hash: passwordHash,
      address,
      cep,
      whatsapp,
    })

    return {
      org,
    }
  }
}
