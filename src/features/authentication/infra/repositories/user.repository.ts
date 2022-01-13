import { User } from "../../domain/models/user";

interface UserCreate {
  name: string;
  email: string;
  document: string;
  phone: string;
  hashPassword: string;
}

export class UserRepository {
  async loadUserByEmail(email: string): Promise<boolean> {
    // procura o usuário pelo e-mail na base de dados
    return false;
  }

  async loadUserByDocument(document: string): Promise<boolean> {
    // procura o usuário pelo documento (cpf, cnpj) na base dados
    return false;
  }

  async createUser(user: UserCreate): Promise<User> {
    return {} as any;
  }
}
