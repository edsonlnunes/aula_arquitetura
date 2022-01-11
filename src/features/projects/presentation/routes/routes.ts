import { Router } from "express";
import { CreateProjectController } from "../controllers/create-project.controller";
import { GetAllProjectsController } from "../controllers/get-all-projects.controller";
import { GetOneProjectController } from "../controllers/get-one-project.controller";
import { UpdateProjectController } from "../controllers/update-project.controller";

/**
 * Este arquivo tem a obrigação de definir as rotas dessa feature
 * No arquivo definimos a rota e chamamos os controllers responsaveis por cada ação.
 */
export default class ProjectRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/projects", new CreateProjectController().handle);
    routes.put("/projects/:uid", new UpdateProjectController().handle);
    routes.get("/projects/:uid", new GetOneProjectController().handle);
    routes.get("/projects", new GetAllProjectsController().handle);

    return routes;
  }
}
