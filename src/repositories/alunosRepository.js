/** Repositório: único local responsável pelas operações no banco. */
export function criarAlunosRepository(prisma) {
  return {
    listar: () => prisma.aluno.findMany({ orderBy: { id: 'asc' } }),
    buscarPorId: (id) => prisma.aluno.findUnique({ where: { id } }),
    cadastrar: (dados) => prisma.aluno.create({ data: dados }),
  };
}
