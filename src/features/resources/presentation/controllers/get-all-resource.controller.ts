import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { Resource } from "../../domain/models/resource";
import { ResourceRepository } from "../../infra/repositories/resource.repository";

export class GetAllResourceController {
  async handle(req: Request, res: Response): Promise<any> {
    try {
      const cache = new CacheRepository();

      const resourcesCache: Resource[] | undefined = await cache.get(
        "resources"
      );

      if (resourcesCache) {
        return ok(
          res,
          resourcesCache.map((resource) => ({
            ...resource,
            _cache: true,
          }))
        );
      }

      const repository = new ResourceRepository();
      const resources = await repository.getAllResources();

      if (!resources) return notFound(res);

      await cache.set("resources", resources);

      return ok(res, resources);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
