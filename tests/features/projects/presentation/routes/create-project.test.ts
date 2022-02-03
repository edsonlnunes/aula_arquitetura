import request from "supertest";
import express from "express";
import App from "../../../../../src/core/presentation/app";
import ProjectRoutes from "../../../../../src/features/projects/presentation/routes/routes";
import Database from "../../../../../src/core/infra/data/connections/database";
import Redis from "../../../../../src/core/infra/data/connections/redis";
import { ProjectRepository } from "../../../../../src/features/projects/infra/repositories/project.repository";

// jest.mock("ioredis"); // ESTRATÉGIA 01 PARA TRABALHAR COM REDIS

jest.mock("ioredis", () => require("ioredis-mock")); // ESTRATÉGIA 02 PARA TRABALHAR COM REDIS

describe("POST /projects", () => {
  const database = new Database();
  const redis = new Redis();
  const server = new App().server;

  beforeAll(async () => {
    await database.openConnection();
    await redis.openConnection();
    server.use(express.json());
    server.use(new ProjectRoutes().init());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await database.closeConnection();
    await redis.closeConnection();
  });

  // ESTRATÉGIA 01 PARA TRABALHAR COM REDIS
  /* test("Deve retornar 200 com um projeto criado só com nome, descricao, uid", async () => {
    // precisa enviar as informações na requisição
    // criar o projeto no banco de dados
    // salvar no cache o projeto criado
    // limpar a lista de projetos do cache

    const spySetRedis = jest
      .spyOn(IORedis.prototype, "set")
      .mockResolvedValue("OK");
      
    const spyDelRedis = jest.spyOn(IORedis.prototype, "del");

    await request(server)
      .post("/projects")
      .send({
        title: "any_name",
        detail: "any_description",
      })
      .expect(200)
      .expect((res) => {
        console.log(res.body);
        //   const projectCreated = req.body
        expect(res.body.uid).toBeTruthy();
        expect(res.body.title).toBe("any_name");
        expect(res.body.detail).toBe("any_description");
        expect(res.body.expectEndDate).toBeFalsy();
        expect(res.body.expectStartDate).toBeFalsy();

        expect(spySetRedis).toHaveBeenCalledTimes(1);
        expect(spySetRedis).toHaveBeenCalledWith(
          `project:${res.body.uid}`,
          JSON.stringify(res.body)
        );

        expect(spyDelRedis).toHaveBeenCalledTimes(1);
        expect(spyDelRedis).toBeCalledWith("projects");
      });
  }); */

  // ESTRATÉGIA 02 PARA TRABALHAR COM O REDIS
  test("Deve retornar 200 com um projeto criado só com nome, descricao, uid", async () => {
    // precisa enviar as informações na requisição
    // criar o projeto no banco de dados
    // salvar no cache o projeto criado
    // limpar a lista de projetos do cache

    await request(server)
      .post("/projects")
      .send({
        title: "any_name",
        detail: "any_description",
      })
      .expect(200)
      .expect(async (res) => {
        console.log(res.body);
        //   const projectCreated = req.body
        expect(res.body.uid).toBeTruthy();
        expect(res.body.title).toBe("any_name");
        expect(res.body.detail).toBe("any_description");
        expect(res.body.expectEndDate).toBeFalsy();
        expect(res.body.expectStartDate).toBeFalsy();

        const instanceRedis = await redis.getConnection();

        expect(instanceRedis.exists(`project:${res.body.uid}`)).resolves.toBe(
          1
        );

        expect(instanceRedis.exists(`projects`)).resolves.toBe(0);
      });
  });

  test("Deve retornar 200 com um projeto criado com todas as informações", async () => {
    // precisa enviar as informações na requisição
    // criar o projeto no banco de dados
    // salvar no cache o projeto criado
    // limpar a lista de projetos do cache

    const now = new Date();

    await request(server)
      .post("/projects")
      .send({
        title: "any_name",
        detail: "any_description",
        startDate: now,
        endDate: now,
      })
      .expect(200)
      .expect(async (res) => {
        console.log(res.body);
        //   const projectCreated = req.body
        expect(res.body.uid).toBeTruthy();
        expect(res.body.title).toBe("any_name");
        expect(res.body.detail).toBe("any_description");
        expect(res.body.expectStartDate).toBe(now.toJSON());
        expect(res.body.expectEndDate).toBe(now.toJSON());

        const instanceRedis = await redis.getConnection();

        expect(instanceRedis.exists(`project:${res.body.uid}`)).resolves.toBe(
          1
        );

        expect(instanceRedis.exists(`projects`)).resolves.toBe(0);
      });
  });

  test("Deve retornar 500 com Internal Server Error", async () => {
    jest
      .spyOn(ProjectRepository.prototype, "create")
      .mockRejectedValue(new Error("any_erro"));

    await request(server).post("/projects").send().expect(500, {
      error: "Internal Server Error",
      message: "any_erro",
    });
  });
});
