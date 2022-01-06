import express, { Response, Request } from "express";
import cors from "cors";
import ProjectRoutes from "../../features/projects/presentation/routes/routes";

export default class App {
  readonly #express: express.Express;

  constructor() {
    this.#express = express();
  }

  public init() {
    this.middlewares();
    this.routes();
  }

  public middlewares() {
    this.#express.use(cors());
    this.#express.use(express.json());
  }

  public routes() {
    this.#express.get("/", (req: Request, res: Response) =>
      res.status(200).send("ok")
    );

    const projectRoutes = new ProjectRoutes().init();
    this.#express.use(projectRoutes);
  }

  public start(port: string) {
    this.#express.listen(port, () => {
      console.log(`api running... ${port}`);
    });
  }
}
