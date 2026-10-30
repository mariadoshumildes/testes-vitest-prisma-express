import express from 'express';
import { criarAlunosRoutes } from './routes/alunosRoutes.js';

/** Configuração do app separada do listen(): Supertest não precisa abrir porta. */
export function criarApp(alunosService) {
  const app = express();
  app.use(express.json());

  app.use('/alunos', criarAlunosRoutes(alunosService));

  app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
  });

  app.use((erro, req, res, next) => {
    if (erro?.status === 400 || erro?.status === 404) {
      return res.status(erro.status).json({ erro: erro.message });
    }
    console.error('Falha ao processar a requisição:', erro);
    return res.status(500).json({ erro: 'Erro interno do servidor.' });
  });

  return app;
}
