import { Router } from 'express';

/** Rotas recebem o serviço por injeção de dependência para facilitar o mock. */
export function criarAlunosRoutes(servico) {
  const router = Router();

  router.get('/', async (req, res, next) => {
    try {
      res.status(200).json(await servico.listar());
    } catch (erro) {
      next(erro);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      res.status(200).json(await servico.buscarPorId(req.params.id));
    } catch (erro) {
      next(erro);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      res.status(201).json(await servico.cadastrar(req.body));
    } catch (erro) {
      next(erro);
    }
  });

  return router;
}
