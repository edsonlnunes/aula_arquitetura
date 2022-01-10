import { ProjectEntity } from "../../../../core/infra/data/database/entities/ProjectEntity";
import { Project } from "../../domain/models/project";

interface Params {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

/**
 * Aqui estamos usando também um outro pattern que se chama: repository pattern
 *
 * Os repositories são responsável por manipular(guardar ou prover) os dados que
 * vamos trabalhar na aplicação. Os dados podem vir de qualquer lugar, tudo vai depender
 * do contexto e cenário que estamos, mas nesse caso e provavelmente todos os cenário de
 * uma aplicação backend os dados vão vir ou vão ser salvos no banco de dados.
 *
 * Logo, os repositories que vamos criar sempre vão para interagir com o banco de dados.
 */
export class ProjectRepository {
  /**
   * Este método CREATE tem a responsabilidade de salvar um projeto no banco de dados,
   * ele recebe as informações via parâmetros e é feito uma lógica para salvar as informações
   * na base de dados.
   */
  async create(data: Params): Promise<Project> {
    /**
     * Cria uma instância da classe ProjectEntity passando os dados.
     *
     * A maneira que foi feito aqui é a mesma coisa do que fazer desse jeito:
     *
     * new ProjectEntity(data.name, data.description, data.startDate, data.endDate)
     *
     * OBS: Considerando que a classe ProjectEntity tenha um construtor recebendo
     * os parametros definido.
     */
    const project = ProjectEntity.create({
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    // de falto salta as informações no banco de dados
    await project.save();

    // retorna as informações conforme o tipo de retorno do método.
    return {
      uid: project.uid,
      title: project.name,
      detail: project.description,
      expectEndDate: project.endDate,
      expectStartDate: project.startDate,
    };
  }

  async getByUid(uid: string): Promise<Project | undefined> {
    console.log("vai consultar o banco para recuperar o registro pelo uid");

    return {} as any;
  }
}
