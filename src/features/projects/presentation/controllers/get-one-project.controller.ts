import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { ProjectRepository } from "../../infra/repositories/project.repository";

export class GetOneProjectController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log(
      "lógica para buscar um projeto por um identificador (uid) acessando o repositório"
    );
    try {
      const { uid } = req.params;

      const repository = new ProjectRepository();

      const project = await repository.getByUid(uid);

      if (!project) return notFound(res);

      return ok(res, project);
    } catch (error) {
      serverError(res);
    }
  }
}
