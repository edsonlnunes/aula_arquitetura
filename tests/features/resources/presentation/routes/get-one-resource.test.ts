import request from "supertest";
import express from "express";
import { ResourcesRoutes } from "../../../../../src/features/resources/presentation/routes/routes";

describe("GET /resources/UID", () => {
  let server: express.Express;

  beforeAll(() => {
    server = express();
    server.use(express.json());
    server.use(new ResourcesRoutes().init());
  });

  test("deve retornar 200 com o recurso encontrado", async () => {
    await request(server)
      .get("/resources/algum_uid")
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.uid).toBe("algum_uid");
        expect(res.body.name).toBe("any_name");
        expect(res.body.description).toBe("any_description");
        expect(res.body.price).toBe(12);
        expect(res.body.unit).toBe(3);
      });
  });

  test("deve retornar 404 quando recurso não for encontrado", async () => {
    await request(server)
      .get("/resources/uid_nao_encontrado")
      .send()
      .expect(404, { error: "Data not found" });
  });

  test("deve retornar 500 quando ocorrer um erro não tratado", async () => {
    await request(server)
      .get("/resources/uid_error_nao_tratado")
      .send()
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });
});
