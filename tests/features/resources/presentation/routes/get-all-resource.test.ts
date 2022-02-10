// deve buscar a lista de recursos
// se não tiver nenhum recurso no banco, deve retornar um 404
// se acontecer um erro não tratado, deve retornar um 500 com uma mensagem

import request from "supertest";
import express from "express";
import { ResourcesRoutes } from "../../../../../src/features/resources/presentation/routes/routes";
import Database from "../../../../../src/core/infra/data/connections/database";
import { ResourceEntity } from "../../../../../src/core/infra/data/database/entities/ResourceEntity";
import Redis from "../../../../../src/core/infra/data/connections/redis";

jest.mock("ioredis", () => require("ioredis-mock"));

describe("GET /resources", () => {
  let server: express.Express;
  const database = new Database();
  const redis = new Redis();

  beforeAll(async () => {
    server = express();
    server.use(express.json());
    server.use(new ResourcesRoutes().init());
    await database.openConnection();
    await redis.openConnection();
  });

  afterEach(async () => {
    await ResourceEntity.clear();
    await (await redis.getConnection()).flushall();
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await database.closeConnection();
    await redis.closeConnection();
  });

  test("deve retornar 200 com uma lista do redis contendo 2 recursos", async () => {
    const resource1 = {
      uid: "any_uid",
      name: "any_name",
      description: "any_description",
      price: 12,
      unit: 3,
    };

    const resource2 = {
      uid: "any_uid_2",
      name: "any_name_2",
      description: "any_description_2",
      price: 10,
      unit: 1,
    };

    const redisConnection = await redis.getConnection();

    await redisConnection.set(
      "resources",
      JSON.stringify([resource1, resource2])
    );

    await request(server)
      .get("/resources")
      .send()
      .expect(200)
      .expect(async (res) => {
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toEqual({
          uid: resource1.uid,
          name: resource1.name,
          description: resource1.description,
          price: resource1.price,
          unit: resource1.unit,
          _cache: true,
        });
        expect(res.body[1]).toEqual({
          uid: resource2.uid,
          name: resource2.name,
          description: resource2.description,
          price: resource2.price,
          unit: resource2.unit,
          _cache: true,
        });

        // const allResources = await ResourceEntity.find();
        // expect(allResources).toHaveLength(2);
      });
  });

  test("deve retornar 200 com uma lista do banco de dados contendo 2 recursos", async () => {
    const resource1 = await ResourceEntity.create({
      name: "any_name",
      description: "any_description",
      price: 12,
      unit: 3,
    }).save();

    const resource2 = await ResourceEntity.create({
      name: "any_name_2",
      description: "any_description_2",
      price: 10,
      unit: 1,
    }).save();

    await request(server)
      .get("/resources")
      .send()
      .expect(200)
      .expect(async (res) => {
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toEqual({
          uid: resource1.uid,
          name: resource1.name,
          description: resource1.description,
          price: resource1.price,
          unit: resource1.unit,
          _cache: undefined,
        });
        expect(res.body[1]).toEqual({
          uid: resource2.uid,
          name: resource2.name,
          description: resource2.description,
          price: resource2.price,
          unit: resource2.unit,
          _cache: undefined,
        });

        const redisConnection = await redis.getConnection();

        await expect(redisConnection.exists("resources")).resolves.toBe(1);

        // const allResources = await ResourceEntity.find();
        // expect(allResources).toHaveLength(2);
      });
  });

  test("deve retornar 404 com a mensagem de recursos não encontrado", async () => {
    await request(server)
      .get("/resources")
      .send()
      .expect(404, { error: "Data not found" });
  });

  test("deve retornar 500 quando ocorrer um erro não tratado", async () => {
    jest
      .spyOn(ResourceEntity, "find")
      .mockRejectedValue(new Error("any_error"));

    await request(server)
      .get("/resources")
      .send()
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });
});
