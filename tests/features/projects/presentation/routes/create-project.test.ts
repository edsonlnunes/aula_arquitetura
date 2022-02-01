import request from "supertest";
import express from "express";
import App from "../../../../../src/core/presentation/app";
import ProjectRoutes from "../../../../../src/features/projects/presentation/routes/routes";
import Database from "../../../../../src/core/infra/data/connections/database";

jest.mock("ioredis");

describe("POST /projects", () => {
  const database = new Database();
  const server = new App().server;

  beforeAll(async () => {
    await database.openConnection();
    server.use(express.json());
    server.use(new ProjectRoutes().init());
  });

  test("Deve retornar 200 com um projeto criado só com nome, descricao, uid", async () => {
    // precisa enviar as informações na requisição
    // criar o projeto no banco de dados
    // salvar no cache o projeto criado
    // limpar a lista de projetos do cache

    await request(server)
      .post("/projects")
      .send({
        name: "any_name",
        description: "any_description",
      })
      .expect(200)
      .expect((res) => {
        console.log(res);
        //   const projectCreated = req.body
        expect(res.body.uid).toBeTruthy();
        expect(res.body.name).toBe("any_name");
        expect(res.body.description).toBe("any_description");
        expect(res.body.startDate).toBeFalsy();
        expect(res.body.endDate).toBeFalsy();
      });
  });
});
