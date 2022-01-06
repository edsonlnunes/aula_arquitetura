import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { ProjectRepository } from "../../infra/repositories/project.repository";

export class CreateProjectController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      const repository = new ProjectRepository();

      const project = await repository.create(req.body);

      return ok(res, project);
    } catch (error) {
      return serverError(res);
    }
  }
}
