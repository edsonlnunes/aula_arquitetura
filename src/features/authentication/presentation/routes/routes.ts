import { Router } from "express";
import { SignUpController } from "../controllers/signup.controller";

export default class AuthenticationRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/signup", new SignUpController().handle);

    return routes;
  }
}
