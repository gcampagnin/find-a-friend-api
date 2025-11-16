# Find a Friend API

API REST construída durante a trilha Ignite da Rocketseat para conectar ONGs e pessoas interessadas em adotar animais. O backend centraliza o cadastro das organizações, registro dos pets e exposição de endpoints com filtros granulares para facilitar a busca por cidade e características específicas.

> O repositório contém apenas a API. Você pode utilizá-la em qualquer frontend, mobile ou automação capaz de consumir HTTP/JSON.

---

## 📌 Principais funcionalidades

- Cadastro e autenticação de ONGs com endereço e WhatsApp obrigatórios.
- Registro de pets vinculado à ONG autenticada, garantindo vínculo e rastreabilidade.
- Listagem paginada de pets por cidade com filtros opcionais (idade, porte, energia, independência e ambiente).
- Visualização detalhada de um pet contendo informações da ONG e contato via WhatsApp.
- Autorização baseada em JWT nas rotas que exigem contexto de ONG.
- Testes automatizados para os casos de uso críticos.

---

## 🧱 Stack e padrões adotados

- **Node.js + TypeScript** para o runtime e tipagem.
- **Fastify 5** como framework HTTP, com JWT embutido e middlewares enxutos.
- **Prisma ORM** com **SQLite** por padrão (basta ajustar `DATABASE_URL` para outro banco compatível).
- **Zod** para validação de schemas de entrada e configuração.
- **bcryptjs** para hashing das senhas de ONG.
- **Vitest** e **Supertest** para testes unitários/e2e dos casos de uso.
- Arquitetura em camadas com ênfase nos princípios **SOLID**: camada HTTP → casos de uso → repositórios (Prisma ou in-memory nos testes).

---

## 🔐 Variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste os valores:

| Variável      | Descrição                                               | Valor padrão |
| ------------- | ------------------------------------------------------- | ------------- |
| `DATABASE_URL`| String de conexão do Prisma. Usa SQLite local por padrão.| `file:./dev.db` |
| `JWT_SECRET`  | Segredo usado para assinar tokens JWT.                  | `super-secret` |
| `PORT`        | Porta exposta pelo servidor Fastify.                   | `3333` |

> A validação acontece em `src/env/index.ts`. A aplicação não sobe se algo estiver ausente.

---

## 🚀 Como rodar o projeto

1. **Instale as dependências**
   ```bash
   npm install
   ```
2. **Configure o ambiente**
   ```bash
   cp .env.example .env
   # ajuste JWT_SECRET e DATABASE_URL se necessário
   ```
3. **Execute as migrações do Prisma**
   ```bash
   npm run migrate:dev
   ```
4. **Suba o servidor em modo desenvolvimento**
   ```bash
   npm run dev
   ```
   O Fastify inicia em `http://localhost:3333`.

Para ambientes produtivos utilize `npm run build && npm run start` e aplique `npm run migrate:deploy` antes da subida.

---

## 🔧 Scripts disponíveis

| Comando | Descrição |
| ------- | --------- |
| `npm run dev` | Executa o servidor com `tsx watch`. |
| `npm run build` | Compila o TypeScript para `dist`. |
| `npm start` | Sobe a versão compilada. |
| `npm run test` | Roda a suíte do Vitest uma vez. |
| `npm run test:watch` | Reexecuta os testes em modo watch. |
| `npm run migrate:dev` | Aplica e gera migrations durante o desenvolvimento. |
| `npm run migrate:deploy` | Aplica migrations prontas (produção). |
| `npm run prisma:generate` | Regenera o client do Prisma. |

---

## 🗂️ Arquitetura em alto nível

- **src/http**: rotas, middlewares e inicialização do Fastify.
- **src/modules**: casos de uso, interfaces de repositórios e implementações (Prisma + in-memory).
- **src/lib**: integrações compartilhadas (ex.: client Prisma).
- **src/shared**: erros e utilitários comuns.
- **prisma**: schema do banco e migrations.

```
src/
 ├─ http/
 │   ├─ routes/
 │   └─ middlewares/
 ├─ modules/
 │   ├─ orgs/
 │   └─ pets/
 ├─ env/
 ├─ lib/
 └─ shared/
```

Os casos de uso isolam as regras de negócio (ex.: `register-org`, `register-pet`) e recebem repositórios por injeção de dependência. Isso facilita testes unitários e permite trocar a camada de persistência com mínimo impacto.

---

## 📡 Endpoints

| Método | Rota | Descrição | Autenticação |
| ------ | ---- | --------- | ------------ |
| `POST` | `/orgs` | Cadastra uma ONG. Corpo com nome, email, senha, endereço, CEP e WhatsApp. | Pública |
| `POST` | `/sessions` | Faz login da ONG e retorna JWT + dados básicos. | Pública |
| `POST` | `/pets` | Registra um pet vinculado à ONG autenticada (nome, espécie, idade, porte, filtros, fotos etc.). | JWT |
| `GET` | `/pets?city=...&filters...` | Lista pets disponíveis obrigatoriamente por cidade, aceitando filtros e paginação (`page`, `pageSize`). | Pública |
| `GET` | `/pets/:id` | Detalha um pet, incluindo contato (WhatsApp) da ONG responsável. | Pública |

Consulte `src/http/routes/*.ts` para detalhes de payloads, validações via Zod e mensagens de erro.

---

## 🌱 Banco de dados

- Schema definido em `prisma/schema.prisma`, com modelos `Org` e `Pet`.
- SQLite é o padrão para desenvolvimento local, mas basta trocar `DATABASE_URL` por qualquer banco suportado pelo Prisma (PostgreSQL, MySQL, etc).
- Use `npx prisma studio` para inspecionar registros durante o desenvolvimento.

---

## 🧪 Testes

Os testes escritos em Vitest garantem o comportamento dos casos de uso com repositórios in-memory (sem depender do banco real). Execute:

```bash
npm run test
```

Na saída você verá cenários cobrindo autenticação de ONG, registro/listagem de pets e busca por detalhes. Adapte/expanda conforme novas regras forem adicionadas.

---

## 🤝 Contribuição

1. Abra uma issue descrevendo sua proposta.
2. Crie uma branch baseada em `main`.
3. Garanta que `npm run test` esteja passando.
4. Envie o PR descrevendo claramente o impacto e eventuais passos de migração.

---

## 📝 Licença

Projeto distribuído sob a licença **ISC** (veja `package.json`).

Divirta-se construindo experiências que ajudem pessoas a encontrar seu próximo amigo! 🐾
