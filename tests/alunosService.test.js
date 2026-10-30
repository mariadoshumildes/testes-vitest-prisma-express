import { describe, it, expect, vi, beforeEach } from 'vitest';
import { criarAlunosService, ErroValidacao, ErroNaoEncontrado } from '../src/services/alunosService.js';

describe('Teste unitário - serviço de alunos', () => {
  let repositorio;
  let servico;

  beforeEach(() => {
    // Mock: imita o banco de dados sem conectar ao PostgreSQL.
    repositorio = {
      listar: vi.fn(),
      buscarPorId: vi.fn(),
      cadastrar: vi.fn(),
    };
    servico = criarAlunosService(repositorio);
  });

  it('cadastra um aluno normalizando nome e e-mail', async () => {
    const aluno = { id: 1, nome: 'Maria', email: 'maria@email.com' };
    repositorio.cadastrar.mockResolvedValue(aluno);

    const resultado = await servico.cadastrar({ nome: '  Maria  ', email: ' MARIA@EMAIL.COM ' });

    expect(resultado).toEqual(aluno);
    expect(repositorio.cadastrar).toHaveBeenCalledWith({
      nome: 'Maria', email: 'maria@email.com',
    });
  });

  it('não cadastra aluno sem nome', async () => {
    await expect(servico.cadastrar({ nome: ' ', email: 'maria@email.com' }))
      .rejects.toBeInstanceOf(ErroValidacao);
    expect(repositorio.cadastrar).not.toHaveBeenCalled();
  });

  it('retorna erro ao buscar um aluno inexistente', async () => {
    repositorio.buscarPorId.mockResolvedValue(null);
    await expect(servico.buscarPorId('10')).rejects.toBeInstanceOf(ErroNaoEncontrado);
    expect(repositorio.buscarPorId).toHaveBeenCalledWith(10);
  });

  it('rejeita e-mail em formato inválido', async () => {
    await expect(servico.cadastrar({ nome: 'Maria', email: 'sem-arroba' }))
      .rejects.toBeInstanceOf(ErroValidacao);
    expect(repositorio.cadastrar).not.toHaveBeenCalled();
  });
});
