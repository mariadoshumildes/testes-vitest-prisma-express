import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { criarAlunosRepository } from './repositories/alunosRepository.js';
import { criarAlunosService } from './services/alunosService.js';
import { criarApp } from './app.js';

const prisma = new PrismaClient();
const repositorio = criarAlunosRepository(prisma);
const servico = criarAlunosService(repositorio);
const app = criarApp(servico);
const porta = Number(process.env.PORT) || 3000;

const servidor = app.listen(porta, () => {
  console.log(`API disponível em http://localhost:${porta}/alunos`);
});

async function encerrar() {
  servidor.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', encerrar);
process.on('SIGTERM', encerrar);
