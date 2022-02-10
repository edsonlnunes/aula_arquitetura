import { Response, Request } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  badRequest,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { ResourceRepository } from "../../infra/repositories/resource.repository";

export class CreateResourceController {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      // const result = {
      //   uid: "any",
      //   name: 'any_name',
      //   description: 'any_description',
      //   price: 10,
      //   unit: 2,
      // };

      // if (req.body.price === 0) {
      //   return res.status(400).json({ error: "Preço precisa ser maior que 0" });
      // }

      if (!req.body.price) {
        return badRequest(res, "Preço obrigatório e deve ser maior que 0");
        // return res
        //   .status(400)
        //   .json({ error: "Preço obrigatório e deve ser maior que 0" });
      }

      if (!req.body.unit) {
        return badRequest(res, "Unidade obrigatória e deve ser maior que 0");
        // return res
        //   .status(400)
        //   .json({ error: "Unidade obrigatória e deve ser maior que 0" });
      }

      const repository = new ResourceRepository();

      const resource = await repository.createResource(req.body);

      const cache = new CacheRepository();
      await cache.set(`resource:${resource.uid}`, resource);
      await cache.delete("resources");

      return ok(res, resource);
      // return res.status(200).json({ ...req.body, uid: uuid() });
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
