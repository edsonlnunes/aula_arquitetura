import { ResourceEntity } from "../../../../core/infra/data/database/entities/ResourceEntity";
import { Resource } from "../../domain/models/resource";

interface ResourceParams {
  name: string;
  description: string;
  price: number;
  unit: number;
}

export class ResourceRepository {
  async createResource(data: ResourceParams): Promise<Resource> {
    const resource = await ResourceEntity.create({
      name: data.name,
      description: data.description,
      price: data.price,
      unit: data.unit,
    }).save();

    return this.mapperEntityToModel(resource);
  }

  async getResourceByUid(uid: string): Promise<Resource | undefined> {
    const resource = await ResourceEntity.findOne(uid);

    if (!resource) return undefined;

    return this.mapperEntityToModel(resource);
  }

  async getAllResources(): Promise<Resource[] | undefined> {
    const resources = await ResourceEntity.find();

    if (resources.length === 0) return undefined;

    return resources.map(this.mapperEntityToModel);
  }

  private mapperEntityToModel(entity: ResourceEntity): Resource {
    return {
      uid: entity.uid,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      unit: entity.unit,
    };
  }
}
