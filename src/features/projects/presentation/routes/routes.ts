import { Router } from "express";
import { CreateProjectController } from "../controllers/create-project.controller";

export default class ProjectRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/projects", new CreateProjectController().handle);

    return routes;
  }
}
