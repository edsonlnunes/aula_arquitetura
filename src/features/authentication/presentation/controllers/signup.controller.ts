import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  serverError,
  ok,
  badRequest,
} from "../../../../core/presentation/helpers/http-helper";
import { CreateUser } from "../../domain/usecases/create-user.usecase";
import { UserRepository } from "../../infra/repositories/user.repository";

export class SignUpController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    /**
     * Lógica para receber a requisição e acessar
     * a camada domain através dos usecases (casos de uso)
     * para executar a lógica de criar um usuário
     */

    const data = req.body;

    if (data.password !== data.confirmPassword) {
      return badRequest(res);
    }

    try {
      const usecase = new CreateUser(new UserRepository());

      const result = await usecase.execute(req.body);

      return ok(res, result);
    } catch (error) {
      return serverError(res);
    }
  }
}
