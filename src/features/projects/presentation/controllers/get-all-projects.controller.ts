import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";

export class GetAllProjectsController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      res.status(200).send("criando projeto");
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
