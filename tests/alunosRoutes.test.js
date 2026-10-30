import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { criarApp } from '../src/app.js';
import { ErroNaoEncontrado, ErroValidacao } from '../src/services/alunosService.js';

describe('Teste de rota - API /alunos com Supertest', () => {
  let servico;
  let app;

  beforeEach(() => {
    // Serviços simulados: testa a resposta HTTP sem banco real.
    servico = {
      listar: vi.fn(),
      buscarPorId: vi.fn(),
      cadastrar: vi.fn(),
    };
    app = criarApp(servico);
  });

  it('GET /alunos devolve a lista de alunos (200)', async () => {
    const alunos = [{ id: 1, nome: 'Maria', email: 'maria@email.com' }];
    servico.listar.mockResolvedValue(alunos);

    const resposta = await request(app).get('/alunos');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toEqual(alunos);
    expect(servico.listar).toHaveBeenCalledOnce();
  });

  it('POST /alunos cria um novo aluno (201)', async () => {
    const dados = { nome: 'João', email: 'joao@email.com' };
    servico.cadastrar.mockResolvedValue({ id: 2, ...dados });

    const resposta = await request(app).post('/alunos').send(dados);

    expect(resposta.status).toBe(201);
    expect(resposta.body).toEqual({ id: 2, ...dados });
    expect(servico.cadastrar).toHaveBeenCalledWith(dados);
  });

  it('GET /alunos/99 informa que o aluno não foi encontrado (404)', async () => {
    servico.buscarPorId.mockRejectedValue(new ErroNaoEncontrado('Aluno não encontrado.'));

    const resposta = await request(app).get('/alunos/99');

    expect(resposta.status).toBe(404);
    expect(resposta.body).toEqual({ erro: 'Aluno não encontrado.' });
  });

  it('POST /alunos repassa erros de validação como HTTP 400', async () => {
    servico.cadastrar.mockRejectedValue(new ErroValidacao('Nome e e-mail são obrigatórios.'));

    const resposta = await request(app).post('/alunos').send({ nome: '' });

    expect(resposta.status).toBe(400);
    expect(resposta.body).toEqual({ erro: 'Nome e e-mail são obrigatórios.' });
  });
});
