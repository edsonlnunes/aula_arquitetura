import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";

export class GetAllProjectsController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para buscar todos os projetos");
  }
}
