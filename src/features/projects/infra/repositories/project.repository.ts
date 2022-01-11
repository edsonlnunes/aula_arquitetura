import { ProjectEntity } from "../../../../core/infra/data/database/entities/ProjectEntity";
import { Project } from "../../domain/models/project";

interface ProjectParams {
  uid?: string;
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
  async create(data: ProjectParams): Promise<Project> {
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
    const projectEntity = ProjectEntity.create({
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    // de falto salta as informações no banco de dados
    await projectEntity.save();

    // retorna as informações conforme o tipo de retorno do método.
    return this.mapperFromEntityToModel(projectEntity);
  }

  async getByUid(uid: string): Promise<Project | undefined> {
    console.log("vai consultar o banco para recuperar o registro pelo uid");

    const projectEntity = await ProjectEntity.findOne(uid);

    if (!projectEntity) return undefined;

    return this.mapperFromEntityToModel(projectEntity);
  }

  async getAll(): Promise<Project[]> {
    console.log("consultar o banco e recuperar todos os registros");
    const projectEntities = await ProjectEntity.find();

    return projectEntities.map((projectEntity) =>
      this.mapperFromEntityToModel(projectEntity)
    );
  }

  async editProject(data: ProjectParams): Promise<Project | undefined> {
    const projectEntity = await ProjectEntity.findOne(data.uid);

    if (!projectEntity) return undefined;

    const projectUpdated = ProjectEntity.create({
      name: data.name,
      description: data.description,
      uid: data.uid,
    });

    await projectUpdated.save();

    return this.mapperFromEntityToModel(projectUpdated);
  }

  /**
   * Método privado (só é visivel dentro desta classe) que encapsula
   * a lógica de transformação de um objeto do tipo ProjectEntity
   * para a model Project.
   *
   * Podemos reutilizar este método em todos os métodos desta classe,
   * sempre que quisermos mapear a entidade para a model
   */
  private mapperFromEntityToModel(entity: ProjectEntity): Project {
    return {
      uid: entity.uid,
      title: entity.name,
      detail: entity.description,
      expectEndDate: entity.endDate,
      expectStartDate: entity.startDate,
    };
  }
}
