# Atividade: testes de software com Node.js, Vitest, Prisma e Express

Este projeto implementa uma **API de alunos** com Express, Prisma e PostgreSQL e demonstra **testes unitários com mocks** e **testes de rotas com Supertest** usando Vitest.

## Tecnologias

- **Node.js**: execução do JavaScript (utilize Node 22.12 ou superior).
- **Express**: rotas HTTP `GET /alunos`, `GET /alunos/:id` e `POST /alunos`.
- **Prisma 6 + PostgreSQL**: persistência no banco, ao executar a API real.
- **Vitest**: testes automatizados e relatório de cobertura.
- **Supertest**: simulação de requisições HTTP sem abrir uma porta.
- **Docker Compose** (opcional): inicialização rápida do PostgreSQL.

> **Importante:** o projeto fixa o Prisma na versão 6.19.0, porque a configuração simplificada em JavaScript usada nesta atividade difere da configuração introduzida no Prisma 7. Não misture os arquivos deste projeto com exemplos de outra versão do Prisma.

## Estrutura

```text
testes-vitest-prisma-express/
├── .env.example
├── .gitignore
├── compose.yaml
├── package.json
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app.js
│   ├── server.js
│   ├── repositories/
│   │   └── alunosRepository.js
│   ├── services/
│   │   └── alunosService.js
│   └── routes/
│       └── alunosRoutes.js
├── tests/
│   ├── alunosService.test.js
│   └── alunosRoutes.test.js
└── vitest.config.js
```

## 1. Instalação e execução dos testes

Abra esta pasta no VS Code e execute no terminal:

```bash
npm install
npm test
```

**Os testes usam mocks** e **não exigem PostgreSQL ativo**. Há 8 testes definidos (4 de serviço e 4 de rota). Se as dependências estiverem corretamente instaladas, o Vitest exibirá os testes executados e seu resultado; verifique localmente se todos passaram.

Para gerar a cobertura:

```bash
npm run test:coverage
```

O relatório de cobertura em HTML, após a execução bem-sucedida, poderá ser aberto em `coverage/index.html`.

## 2. Iniciar o banco de dados e a API real (opcional para os testes)

Para usar Docker Desktop com Docker Compose:

```bash
docker compose up -d
```

No Windows PowerShell, crie um arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

No macOS ou Linux:

```bash
cp .env.example .env
```

Depois rode:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

> Se já existir um PostgreSQL instalado na porta `5432`, ajuste a porta em `compose.yaml` e a `DATABASE_URL` do `.env`. Os valores do exemplo são somente para **desenvolvimento local**. Nunca envie o arquivo `.env` nem credenciais reais ao GitHub.

A API estará em `http://localhost:3000`.

**Endereços:**

- `GET http://localhost:3000/alunos` — lista alunos.
- `GET http://localhost:3000/alunos/1` — busca por ID.
- `POST http://localhost:3000/alunos` — cadastra aluno.

**Exemplo de corpo JSON para POST:**

```json
{
  "nome": "Maria",
  "email": "maria@email.com"
}
```

**Teste do POST no PowerShell:**

```powershell
Invoke-RestMethod -Uri 'http://localhost:3000/alunos' -Method Post -ContentType 'application/json' -Body '{"nome":"Maria","email":"maria@email.com"}'
```

## 3. O que está sendo testado?

**Testes unitários** em `tests/alunosService.test.js` (4 testes):

1. Verifica que nome e e-mail são normalizados antes de cadastrar.
2. Impede o cadastro sem nome.
3. Confirma o erro ao buscar um aluno inexistente.
4. Impede o cadastro de e-mail inválido.

Os métodos do repositório são substituídos por `vi.fn()` para evitar acessos reais ao banco.

**Testes de rotas** em `tests/alunosRoutes.test.js` (4 testes):

1. Verifica `GET /alunos` com HTTP 200.
2. Verifica `POST /alunos` com HTTP 201.
3. Verifica `GET /alunos/99` com HTTP 404.
4. Verifica um erro de validação em `POST /alunos` com HTTP 400.

Com o Supertest, é possível realizar requisições HTTP em memória; o serviço é simulado para testar especificamente o comportamento da rota.

## 4. Publicar no GitHub

Crie um repositório vazio no GitHub com o nome `testes-vitest-prisma-express`. No terminal da pasta do projeto:

```bash
git init
git add .
git commit -m "Implementa API de alunos e testes com Vitest"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/testes-vitest-prisma-express.git
git push -u origin main
```

Troque `SEU_USUARIO` pelo seu nome de usuário do GitHub. Se o Git pedir para configurar nome ou e-mail, faça isso pelo Git. Em seguida, copie o link público do repositório para o fórum. **Atenção:** os comandos acima são instruções; o projeto ainda não foi publicado automaticamente.

## 5. Sugestão de postagem no fórum

**Tema: Testes automatizados em API Node.js com Vitest e Prisma**

Desenvolvi uma API de alunos com Node.js, Express e Prisma, organizada em camadas de rotas, serviço e repositório. Implementei testes unitários com Vitest, utilizando mocks para simular o acesso ao banco, e testes de rotas com Supertest para verificar os códigos HTTP e as respostas da API. A prática ajudou a compreender a importância de testar separadamente as regras de negócio e o comportamento das rotas, além de facilitar a identificação de erros e a manutenção do código.

**Repositório no GitHub:** [COLE AQUI SEU LINK, APÓS PUBLICAR]

**Resultados:** [PREENCHA COM A QUANTIDADE DE TESTES QUE PASSARAM, APÓS EXECUTAR]

## 6. Dois modelos de comentários para colegas

**Comentário 1:** Gostei da organização da sua atividade e da separação entre a aplicação e os testes. Isso facilita a manutenção do código e permite identificar erros com mais rapidez. Uma sugestão seria acrescentar testes de entradas inválidas, caso ainda não tenha feito.

**Comentário 2:** Achei interessante o uso de testes automatizados para validar o comportamento da API. Os mocks ajudam a testar funcionalidades sem depender diretamente do banco de dados. Como melhoria, você poderia verificar também os códigos de erro das rotas e gerar um relatório de cobertura, se ainda não estiver incluído.

> Personalize os comentários depois de ler os repositórios e as postagens dos colegas, para citar boas práticas que você realmente observou.
