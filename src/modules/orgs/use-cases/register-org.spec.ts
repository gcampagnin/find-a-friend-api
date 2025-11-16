import { describe, it, expect, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'

import { RegisterOrgUseCase } from './register-org'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { OrgAlreadyExistsError } from '../errors/org-already-exists-error'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterOrgUseCase

describe('RegisterOrgUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterOrgUseCase(orgsRepository)
  })

  it('should be able to register a new org', async () => {
    const { org } = await sut.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    expect(org.id).toEqual(expect.any(String))
    expect(await compare('123456', org.password_hash)).toBe(true)
  })

  it('should not allow duplicate emails', async () => {
    await sut.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    await expect(
      sut.execute({
        name: 'Another Org',
        email: 'contact@happypets.org',
        password: '654321',
        address: 'Street 2',
        cep: '12345000',
        whatsapp: '555188888888',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })
})
