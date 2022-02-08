import { Request, Response } from "express";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";

export class GetOneResourceController {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      const { uid } = req.params;

      if (uid === "uid_nao_encontrado") {
        return notFound(res);
      }

      if (uid === "uid_error_nao_tratado") {
        throw new Error("any_error");
      }

      return ok(res, {
        uid,
        name: "any_name",
        description: "any_description",
        price: 12,
        unit: 3,
      });
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
