import { randomUUID } from 'node:crypto'

import { Org, Prisma } from '@prisma/client'

import { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []

  async create(data: Prisma.OrgCreateInput) {
    const org: Org = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      address: data.address,
      cep: data.cep,
      whatsapp: data.whatsapp,
      created_at: new Date(),
    }

    this.items.push(org)

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)
    return org ?? null
  }

  async findById(id: string) {
    const org = this.items.find((item) => item.id === id)
    return org ?? null
  }
}
