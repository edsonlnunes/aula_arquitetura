import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { ResourceRepository } from "../../infra/repositories/resource.repository";

export class GetOneResourceController {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      const { uid } = req.params;

      const cache = new CacheRepository();

      const resourceCache = await cache.get(`resource:${uid}`);

      if (resourceCache) {
        return ok(res, { ...resourceCache, _cache: true });
      }

      const repository = new ResourceRepository();

      const resource = await repository.getResourceByUid(uid);

      if (!resource) return notFound(res);

      await cache.set(`resource:${resource.uid}`, resource);

      return ok(res, resource);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
