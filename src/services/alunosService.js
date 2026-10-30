export class ErroValidacao extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroValidacao';
    this.status = 400;
  }
}

export class ErroNaoEncontrado extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'ErroNaoEncontrado';
    this.status = 404;
  }
}

/** Serviço: regras de negócio independentes do Express e do Prisma. */
export function criarAlunosService(repositorio) {
  return {
    async listar() {
      return repositorio.listar();
    },

    async buscarPorId(idRecebido) {
      const id = Number(idRecebido);
      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new ErroValidacao('ID do aluno deve ser um número inteiro positivo.');
      }
      const aluno = await repositorio.buscarPorId(id);
      if (!aluno) {
        throw new ErroNaoEncontrado('Aluno não encontrado.');
      }
      return aluno;
    },

    async cadastrar(dados) {
      const nome = typeof dados?.nome === 'string' ? dados.nome.trim() : '';
      const email = typeof dados?.email === 'string' ? dados.email.trim().toLowerCase() : '';

      if (!nome || !email) {
        throw new ErroValidacao('Nome e e-mail são obrigatórios.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new ErroValidacao('Informe um e-mail válido.');
      }

      return repositorio.cadastrar({ nome, email });
    },
  };
}
