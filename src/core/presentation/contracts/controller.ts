import { Request, Response } from "express";

/**
 * Essa interface é resposável por definir um padrão para todos os controllers
 * que teremos dentro da aplicação, assim, toda controller que for criada terá
 * que respeitar essa interface (contrato)
 *
 * OBS: O nome da interface poderia ser qualquer outro nome, por ex:
 * - WebController
 * - MyController
 * - ControllerPattern
 * - Controlador
 *
 * O nome poderia ser qualquer um, mas sempre é uma boa prática
 * deixar as coisas semanticas, ou seja, com nomes bem definidos e que seja
 * "autoexplicativo"
 */
export interface Controller {
  /**
   * Este é método que vai ser implementado por todas as controllers
   * que respeitarem o contrato Controller.
   *
   * OBS: O nome do método poderia ser qualquer outro nome, por ex:
   * - process
   * - execute
   * - fazAlgumaCoisa
   * - makeLogic
   *
   * Conforme vocês vão conhecendo outros frameworks/libs vocês vão ver
   * que o pessoal costuma usar o nome "handle" para algo que vai executar alguma coisa
   * traduzindo a palavra "handle" temos algo como "lidar com", ou seja, aqui estamos
   * dizendo que o controller vai lidar com alguma coisa, alguma lógica ou algum processo.
   *
   * Para concluir, o nome "handle" pode ser usado quando criamos alguma abstração que
   * vai executar "algo"
   */
  handle(req: Request, res: Response): Promise<any>;
}
