import { Request, Response } from "express";

import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { Login } from "../../domain/usecases/login.usecase";
import { UserRepository } from "../../infra/repositories/user.repository";

export class SignInController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      const usecase = new Login(new UserRepository());

      /// chama o caso de uso (usecase)
      const result = await usecase.execute(req.body);

      /// retorna o que o caso de uso devolver
      return ok(res, result);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
