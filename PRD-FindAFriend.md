# PRD – FindAFriend API

## 1. Visão Geral
O FindAFriend é uma API REST para gerenciamento de adoção de animais, permitindo que ORGs registrem pets disponíveis e usuários encontrem animais para adoção com base na cidade e em filtros opcionais. O sistema é exclusivamente backend e segue princípios SOLID e prática de testes automatizados.

## 2. Objetivos do Sistema
- Facilitar o processo de adoção conectando usuários a ORGs.
- Permitir o cadastro e autenticação de ORGs.
- Registrar pets vinculados às respectivas ORGs.
- Disponibilizar listagem de pets filtrada por cidade e características.
- Garantir arquitetura limpa, modular e testável.

## 3. Escopo da Aplicação
### Funcionalidades Principais
- Cadastro de ORGs.
- Login de ORGs.
- Cadastro de pets vinculados a ORGs.
- Listagem de pets com cidade obrigatória.
- Aplicação de filtros opcionais: idade, porte, nível de energia, independência, ambiente.
- Visualização de detalhes de um pet específico.
- Acesso administrativo somente para ORGs autenticadas.

---

## 4. Regras de Negócio
1. Toda ORG deve ter **endereço** e **número de WhatsApp**.
2. Apenas ORGs logadas podem criar, editar ou remover pets.
3. Todo pet deve estar vinculado a uma ORG.
4. A listagem de pets exige **cidade obrigatória**.
5. Filtros extra são opcionais.
6. O contato para adoção é realizado via WhatsApp da ORG.

---

## 5. Requisitos Funcionais (RF)
### RF01 — Cadastro de ORG
- A API deve permitir cadastrar uma ORG contendo:
  - Nome, email, senha (hash), endereço, CEP, número de WhatsApp.

### RF02 — Login de ORG
- A API deve permitir login autenticando via email e senha.

### RF03 — Cadastro de Pet
- A API deve permitir cadastrar pets vinculados a uma ORG autenticada.
- Campos do pet:
  - Nome, espécie, idade, porte, descrição, requisitos, ambiente, fotos, nível de energia, independência.

### RF04 — Listagem de Pets por Cidade
- A API deve listar pets disponíveis com base na cidade.

### RF05 — Filtros Opcionais
- O usuário poderá filtrar por:
  - Idade  
  - Porte  
  - Nível de energia  
  - Independência  
  - Ambiente

### RF06 — Visualização de Detalhes de Pet
- A API deve permitir retornar todas as informações de um pet específico.

### RF07 — Contato via WhatsApp
- A API deve retornar o número de WhatsApp da ORG proprietária do pet.

---

## 6. Requisitos Não Funcionais (RNF)
### RNF01 — Arquitetura
- A aplicação deve seguir princípios SOLID.
- Deve ser construída de forma modular e desacoplada.

### RNF02 — Testes
- A API deve possuir testes automatizados (unitários e/ou e2e).

### RNF03 — Segurança
- Senhas devem ser armazenadas com hash (BCrypt ou similar).
- Endpoints administrativos devem exigir autenticação JWT.

### RNF04 — Performance e Qualidade
- Uso eficiente de banco de dados.
- Rotas organizadas e documentadas.

---

## 7. Modelo de Entidades (Simplificado)

### Entidade: ORG
| Campo | Tipo |
|-------|------|
| id | uuid |
| name | string |
| email | string |
| password_hash | string |
| address | string |
| cep | string |
| whatsapp | string |

### Entidade: Pet
| Campo | Tipo |
|-------|------|
| id | uuid |
| org_id | uuid |
| name | string |
| city | string |
| age | string |
| size | string |
| energy_level | string |
| independence_level | string |
| environment | string |
| photos | array |
| description | string |

---

## 8. Endpoints (Resumo)

### ORGs
- **POST /orgs** — Cadastro de ORG  
- **POST /sessions** — Login de ORG  

### Pets
- **POST /pets** — Cadastrar pet  
- **GET /pets** — Listar pets por cidade e filtros opcionais  
- **GET /pets/:id** — Detalhar pet  

---

## 9. Checklist de Entrega
- [ ] Rota para cadastrar uma ORG  
- [ ] Rota de login para ORG  
- [ ] Rota para cadastrar um pet vinculado à ORG  
- [ ] Rota para listar pets com cidade obrigatória  
- [ ] Filtros opcionais por características  
- [ ] Rota para visualizar pet específico  
- [ ] Garantir acesso administrativo apenas a ORGs logadas  
- [ ] Aplicar princípios SOLID  
- [ ] Criar testes automatizados  

---

## 10. Considerações Finais
Este PRD define o escopo completo da API FindAFriend, servindo como guia para implementação, validação e futura expansão.
