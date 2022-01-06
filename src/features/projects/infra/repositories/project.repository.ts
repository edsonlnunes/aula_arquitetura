import { ProjectEntity } from "../../../../core/infra/data/database/entities/ProjectEntity";
import { Project } from "../../domain/models/project";

interface Params {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export class ProjectRepository {
  async create(data: Params): Promise<Project> {
    const project = ProjectEntity.create({
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
    });

    await project.save();

    return {
      uid: project.uid,
      name: project.name,
      description: project.description,
      endDate: project.endDate,
      startDate: project.startDate,
    };
  }
}
