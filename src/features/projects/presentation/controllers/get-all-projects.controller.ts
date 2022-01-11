import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { ProjectRepository } from "../../infra/repositories/project.repository";

export class GetAllProjectsController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para buscar todos os projetos acessando o repositório");
    try {
      const repository = new ProjectRepository();

      const projects = await repository.getAll();

      if (projects.length === 0) return notFound(res);

      return ok(res, projects);
    } catch (error) {
      return serverError(res);
    }
  }
}
