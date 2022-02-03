import request from "supertest";
import { v4 as uuid } from "uuid";
import express from "express";
import App from "../../../../../src/core/presentation/app";
import ProjectRoutes from "../../../../../src/features/projects/presentation/routes/routes";
import Database from "../../../../../src/core/infra/data/connections/database";
import Redis from "../../../../../src/core/infra/data/connections/redis";
import { Project } from "../../../../../src/features/projects/domain/models/project";
import { ProjectEntity } from "../../../../../src/core/infra/data/database/entities/ProjectEntity";
import { CacheRepository } from "../../../../../src/core/infra/repositories/cache.repository";

jest.mock("ioredis", () => require("ioredis-mock")); // ESTRATÉGIA 02 PARA TRABALHAR COM REDIS

const makeProject = (): Project => {
  return {
    uid: uuid(),
    title: "any_title",
    detail: "any_detail",
  };
};

const makeProjectDB = async (): Promise<ProjectEntity> => {
  return await ProjectEntity.create({
    name: "any_name",
    description: "any_description",
  }).save();
};

describe("GET /project/uid", () => {
  const database = new Database();
  const redis = new Redis();
  const server = new App().server;

  beforeAll(async () => {
    await database.openConnection();
    await redis.openConnection();
    server.use(express.json());
    server.use(new ProjectRoutes().init());
  });

  afterEach(async () => {
    jest.resetAllMocks();
    // limpa o redis
    // const connectionRedis=await redis.getConnection();
    // await connectionRedis.flushall();
    await (await redis.getConnection()).flushall();
    await ProjectEntity.clear();
  });

  afterAll(async () => {
    await database.closeConnection();
    await redis.closeConnection();
  });

  test("Deve retornar 200 com um projeto do cache", async () => {
    const redisConnection = await redis.getConnection();

    const project = makeProject();

    await redisConnection.set(
      `project:${project.uid}`,
      JSON.stringify(project)
    );

    await request(server)
      .get(`/projects/${project.uid}`)
      .send()
      .expect(200)
      .expect((res) => {
        //   expect(res.body.uid).toBe('any_uid')
        expect(res.body.uid).toBe(project.uid);
        expect(res.body.title).toBe(project.title);
        expect(res.body.detail).toBe(project.detail);
        expect(res.body.expectEndDate).toBeFalsy();
        expect(res.body.expectStartDate).toBeFalsy();
        expect(res.body._cache).toBeTruthy();
      });
  });

  test("Deve retornar 404 com a mensagem Data not found", async () => {
    await request(server)
      .get(`/projects/${uuid()}`)
      .send()
      .expect(404, { error: "Data not found" });
  });

  test("Deve retornar 200 com um projeto do banco de dados", async () => {
    const project = await makeProjectDB();

    await request(server)
      .get(`/projects/${project.uid}`)
      .send()
      .expect(200)
      .expect(async (res) => {
        expect(res.body.uid).toBe(project.uid);
        expect(res.body.title).toBe(project.name);
        expect(res.body.detail).toBe(project.description);
        expect(res.body.expectEndDate).toBeFalsy();
        expect(res.body.expectStartDate).toBeFalsy();
        expect(res.body._cache).toBeFalsy();

        const connectionRedis = await redis.getConnection();

        expect(connectionRedis.exists(`project:${res.body.uid}`)).resolves.toBe(
          1
        );
      });
  });

  test("Deve retornar 500 com Internal Server Error", async () => {
    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockRejectedValue(new Error("any_erro"));

    await request(server).get(`/projects/${uuid()}`).send().expect(500, {
      error: "Internal Server Error",
      message: "any_erro",
    });
  });
});
