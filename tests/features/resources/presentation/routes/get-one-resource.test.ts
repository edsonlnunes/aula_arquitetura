import request from "supertest";
import express from "express";
import { v4 as uuid } from "uuid";
import { ResourcesRoutes } from "../../../../../src/features/resources/presentation/routes/routes";
import { ResourceEntity } from "../../../../../src/core/infra/data/database/entities/ResourceEntity";
import Database from "../../../../../src/core/infra/data/connections/database";
import { ResourceRepository } from "../../../../../src/features/resources/infra/repositories/resource.repository";
import Redis from "../../../../../src/core/infra/data/connections/redis";

jest.mock("ioredis", () => require("ioredis-mock"));

const makeResourceDB = async (): Promise<ResourceEntity> => {
  return await ResourceEntity.create({
    name: "any_name_2",
    description: "any_description",
    price: 12,
    unit: 3,
  }).save();
};

describe("GET /resources/UID", () => {
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

  afterAll(async () => {
    jest.resetAllMocks();
    await ResourceEntity.clear();
    await database.closeConnection();
    await (await redis.getConnection()).flushall();
    await redis.closeConnection();
  });

  test("deve retornar 200 com o recurso encontrado no cache", async () => {
    const resource = await makeResourceDB();

    const redisConnection = await redis.getConnection();

    await redisConnection.set(
      `resource:${resource.uid}`,
      JSON.stringify(resource)
    );

    await request(server)
      .get(`/resources/${resource.uid}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.uid).toBe(resource.uid);
        expect(res.body.name).toBe(resource.name);
        expect(res.body.description).toBe(resource.description);
        expect(res.body.price).toBe(resource.price);
        expect(res.body.unit).toBe(resource.unit);
        expect(res.body._cache).toBeTruthy();
      });
  });

  test("deve retornar 200 com o recurso encontrado no banco de dados", async () => {
    const resource = await makeResourceDB();

    await request(server)
      .get(`/resources/${resource.uid}`)
      .send()
      .expect(200)
      .expect(async (res) => {
        expect(res.body.uid).toBe(resource.uid);
        expect(res.body.name).toBe(resource.name);
        expect(res.body.description).toBe(resource.description);
        expect(res.body.price).toBe(resource.price);
        expect(res.body.unit).toBe(resource.unit);
        expect(res.body._cache).toBeFalsy();

        const redisConnection = await redis.getConnection();

        await expect(
          redisConnection.exists(`resource:${res.body.uid}`)
        ).resolves.toBe(1);
      });
  });

  test("deve retornar 404 quando recurso não for encontrado", async () => {
    await request(server)
      .get(`/resources/${uuid()}`)
      .send()
      .expect(404, { error: "Data not found" });
  });

  test("deve retornar 500 quando ocorrer um erro não tratado", async () => {
    jest
      .spyOn(ResourceRepository.prototype, "getResourceByUid")
      .mockRejectedValue(new Error("any_error"));

    await request(server)
      .get("/resources/uid_error_nao_tratado")
      .send()
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });
});
