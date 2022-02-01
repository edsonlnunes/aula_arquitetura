import express, { Response, Request } from "express";
import cors from "cors";
import ProjectRoutes from "../../features/projects/presentation/routes/routes";
import AuthenticationRoutes from "../../features/authentication/presentation/routes/routes";

/**
 * Éssa é a classe que é responsável por configurar a aplicação e iniciar o servidor
 */
export default class App {
  // cria uma referência do express que é privada e não deixa ser sobescrita depois
  // que definido um valor, ou seja, ela é somente leitura.
  readonly #express: express.Express;

  // de fato, adiciona um valor a referência do express
  constructor() {
    this.#express = express();
  }

  get server(): express.Express {
    return this.#express;
  }

  // inicia toda configuração da aplicação
  public init() {
    this.middlewares();
    this.routes();
  }

  // defini os middlewares default do servidor
  public middlewares() {
    this.#express.use(cors());
    this.#express.use(express.json());
  }

  // defini todas as rotas que a aplicação terá,
  // importando as rotas de cada feature.
  public routes() {
    this.#express.get("/", (req: Request, res: Response) =>
      res.status(200).send("ok")
    );

    const projectRoutes = new ProjectRoutes().init();
    this.#express.use(projectRoutes);

    const authenticationRoutes = new AuthenticationRoutes().init();
    this.#express.use(authenticationRoutes);
  }

  // inicia o servidor express
  public start(port: string) {
    this.#express.listen(port, () => {
      console.log(`api running... ${port}`);
    });
  }
}
