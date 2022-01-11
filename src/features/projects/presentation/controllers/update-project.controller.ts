import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { ProjectRepository } from "../../infra/repositories/project.repository";

export class UpdateProjectController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      const { uid } = req.params;

      const repository = new ProjectRepository();

      const project = await repository.editProject({ uid, ...req.body });

      if (!project) return notFound(res);

      return ok(res, project);
    } catch (error) {
      return serverError(res);
    }
  }
}
