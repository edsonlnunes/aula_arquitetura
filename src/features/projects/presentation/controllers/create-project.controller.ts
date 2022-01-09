import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { ProjectRepository } from "../../infra/repositories/project.repository";

/**
 * Este controller é responsável pela ação de criar um Project,
 * reparem que o nome da classe e o nome do arquivo normalmente já deixa
 * explicito o que esse controller faz, ou seja, neste caso ele vai criar um projeto.
 *
 * Além do nome da classe e do arquivo dizerem o que vai acontecer, reparem também
 * que a classe IMPLEMENTA uma interface que neste caso colocamos o nome de Controller,
 * ou seja, estamos dizendo que essa classe de fato é uma controller da nossa aplicação.
 * Assim, toda controller que implementar e respeitar essa interface (também podemos
 * considerar como um contrato) vai precisar implementar e método handle.
 */
export class CreateProjectController implements Controller {
  /**
   * Dentro do método handle deve ser desenvolvido a lógica de
   * receber a requisição, tratar os dados e escalar o processamento
   * do que deve ser feito para uma outra classe, neste caso está sendo feito isso
   * chamando o método CREATE do ProjectRepository.
   *
   * Todos os controllers vão ter uma estrutura parecida com essa,
   * um TRY/CATCH, onde no CATCH é retornado um serverError e no TRY
   * é retornado um OK com o dado que vai ser retornado.
   */
  async handle(req: Request, res: Response): Promise<any> {
    try {
      const repository = new ProjectRepository();

      const project = await repository.create(req.body);

      return ok(res, project);
    } catch (error) {
      return serverError(res);
    }
  }
}
