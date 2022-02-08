import request from "supertest";
import express from "express";
import { ResourcesRoutes } from "../../../../../src/features/resources/presentation/routes/routes";
import { ResourceEntity } from "../../../../../src/core/infra/data/database/entities/ResourceEntity";
import Database from "../../../../../src/core/infra/data/connections/database";
import { ResourceRepository } from "../../../../../src/features/resources/infra/repositories/resource.repository";

describe("/POST resources", () => {
  let server: express.Express;
  const database = new Database();

  beforeAll(async () => {
    server = express();
    server.use(express.json());
    server.use(new ResourcesRoutes().init());
    await database.openConnection();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await ResourceEntity.clear();
    await database.closeConnection();
  });

  test("deve retornar 200 com um recurso criado", async () => {
    await request(server)
      .post("/resources")
      .send({
        name: "any_name",
        description: "any_description",
        price: 10,
        unit: 2,
      })
      .expect(200)
      .expect(async (res) => {
        expect(res.body.uid).toBeTruthy();
        expect(res.body.name).toBe("any_name");
        expect(res.body.description).toBe("any_description");
        expect(res.body.price).toBe(10);
        expect(res.body.unit).toBe(2);

        const resourceDB = await ResourceEntity.findOne(res.body.uid);
        expect(resourceDB).toBeTruthy();
        expect(resourceDB.name).toBe("any_name");
      });
  });

  test("deve retornar 400 quando informar um price zerado", async () => {
    await request(server)
      .post("/resources")
      .send({
        name: "any_name",
        description: "any_description",
        price: 0,
        unit: 2,
      })
      .expect(400, { error: "Preço obrigatório e deve ser maior que 0" });
  });

  test("deve retornar 400 quando não for informado um price", async () => {
    await request(server)
      .post("/resources")
      .send({
        name: "any_name",
        description: "any_description",
        unit: 2,
      })
      .expect(400, { error: "Preço obrigatório e deve ser maior que 0" });
  });

  test("deve retornar 400 quando informar um unit zerado", async () => {
    await request(server)
      .post("/resources")
      .send({
        name: "any_name",
        description: "any_description",
        price: 10,
        unit: 0,
      })
      .expect(400, { error: "Unidade obrigatória e deve ser maior que 0" });
  });

  test("deve retornar 400 quando não for informado um unit", async () => {
    await request(server)
      .post("/resources")
      .send({
        name: "any_name",
        description: "any_description",
        price: 10,
      })
      .expect(400, { error: "Unidade obrigatória e deve ser maior que 0" });
  });

  test("deve retornar 500 quando ocorrer um erro não tratado", async () => {
    jest
      .spyOn(ResourceRepository.prototype, "createResource")
      .mockRejectedValue(new Error("any_error"));
    await request(server)
      .post("/resources")
      .send({
        name: "any_name",
        description: "any_description",
        price: 10,
        unit: 2,
      })
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });
});
