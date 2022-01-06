import App from "./core/presentation/app";
import Database from "./core/infra/data/connections/database";
import "dotenv/config";

new Database()
  .openConnection()
  .then(() => {
    const app = new App();
    app.init();
    app.start(process.env.PORT || "3333");
  })
  .catch((err) => {
    console.log(err);
  });
