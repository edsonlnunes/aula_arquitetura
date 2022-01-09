import { Router } from "express";
import { CreateProjectController } from "../controllers/create-project.controller";

/**
 * Este arquivo tem a obrigação de definir as rotas dessa feature
 * No arquivo definimos a rota e chamamos os controllers responsaveis por cada ação.
 */
export default class ProjectRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/projects", new CreateProjectController().handle);

    return routes;
  }
}
