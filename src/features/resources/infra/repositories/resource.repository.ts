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

    return {
      uid: resource.uid,
      name: resource.name,
      description: resource.description,
      price: resource.price,
      unit: resource.unit,
    };
  }
}
