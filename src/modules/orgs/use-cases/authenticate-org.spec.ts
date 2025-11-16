import { describe, it, expect, beforeEach } from 'vitest'

import { AuthenticateOrgUseCase } from './authenticate-org'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { RegisterOrgUseCase } from './register-org'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let registerOrg: RegisterOrgUseCase
let sut: AuthenticateOrgUseCase

describe('AuthenticateOrgUseCase', () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    registerOrg = new RegisterOrgUseCase(orgsRepository)
    sut = new AuthenticateOrgUseCase(orgsRepository)
  })

  it('should authenticate with valid credentials', async () => {
    await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    const { org } = await sut.execute({
      email: 'contact@happypets.org',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
  })

  it('should throw when credentials are invalid', async () => {
    await expect(
      sut.execute({
        email: 'unknown@org.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw when password does not match', async () => {
    await registerOrg.execute({
      name: 'Happy Pets',
      email: 'contact@happypets.org',
      password: '123456',
      address: 'Street 1',
      cep: '12345000',
      whatsapp: '555199999999',
    })

    await expect(
      sut.execute({
        email: 'contact@happypets.org',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
