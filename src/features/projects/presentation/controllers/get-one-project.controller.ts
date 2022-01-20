import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { Project } from "../../domain/models/project";
import { ProjectRepository } from "../../infra/repositories/project.repository";

export class GetOneProjectController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log(
      "lógica para buscar um projeto por um identificador (uid) acessando o repositório"
    );
    try {
      const { uid } = req.params;

      // cria uma instância do repositorio que cuida do cache
      const cache = new CacheRepository();

      // recupera o registro no cache
      const projectCache: Project = await cache.get(`project:${uid}`);

      // verifica se encontrou e retorna caso verdadeiro
      if (projectCache) {
        return ok(res, Object.assign({}, projectCache, { _cache: true }));
      }

      // se não encontrou no cache é buscado na base dados
      const repository = new ProjectRepository();
      const project = await repository.getByUid(uid);

      if (!project) return notFound(res);

      // salva no redis para o dado ficar cacheado
      await cache.set(`project:${project.uid}`, project);

      return ok(res, project);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
