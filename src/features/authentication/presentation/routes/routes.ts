import { Router } from "express";
import { SignInController } from "../controllers/signin.controller";
import { SignUpController } from "../controllers/signup.controller";

export default class AuthenticationRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/signup", new SignUpController().handle);
    routes.post("/signin", new SignInController().handle);

    return routes;
  }
}
