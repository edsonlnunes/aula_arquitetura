import { Router } from "express";
import { CreateResourceController } from "../controllers/create-resource.controller";
import { GetAllResourceController } from "../controllers/get-all-resource.controller";
import { GetOneResourceController } from "../controllers/get-one-resource.controller";

export class ResourcesRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/resources", new CreateResourceController().handle);
    routes.get("/resources/:uid", new GetOneResourceController().handle);
    routes.get("/resources", new GetAllResourceController().handle);

    return routes;
  }
}
