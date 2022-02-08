import { Router } from "express";
import { CreateResourceController } from "../controllers/create-resource.controller";
import { GetOneResourceController } from "../controllers/get-one-resource.controller";

export class ResourcesRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/resources", new CreateResourceController().handle);
    routes.get("/resources/:uid", new GetOneResourceController().handle);

    return routes;
  }
}
