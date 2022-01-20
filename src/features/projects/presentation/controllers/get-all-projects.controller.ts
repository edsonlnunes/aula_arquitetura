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

export class GetAllProjectsController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para buscar todos os projetos acessando o repositório");
    try {
      // cria uma instância do repositório do cache
      const cache = new CacheRepository();

      // busca os registro no cache
      const projectsCache = await cache.get("projects");

      // verifica se tem registro, caso verdadeiro, retorna do cache
      if (projectsCache) {
        return ok(
          res,
          (projectsCache as Project[]).map((project) =>
            Object.assign({}, project, { _cache: true })
          )
        );
      }

      const repository = new ProjectRepository();

      const projects = await repository.getAll();

      if (projects.length === 0) return notFound(res);

      // salva no redis para servir de cache
      await cache.set("projects", projects);

      return ok(res, projects);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
