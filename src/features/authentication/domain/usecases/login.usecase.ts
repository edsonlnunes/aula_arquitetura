import { UserRepository } from "../../infra/repositories/user.repository";
import bcrypt from "bcrypt";
import { User } from "../models/user";

interface Credentials {
  login: string;
  password: string;
}

export class Login {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async execute(credentials: Credentials): Promise<User> {
    /// consultar se existe o usuário na base dados
    const user = await this.repository.getUserByLogin(credentials.login);

    // verificar se o usuário de fato existe
    if (!user) throw new Error("Login or password not valid");

    /// verificar se usuário está ativo
    if (!user.enable) throw new Error("User not enable");

    /// validar senhas
    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password as string
    );

    if (!passwordMatch) throw new Error("Login or password not valid");

    const { password, ...userWithoutPass } = user;
    // return Object.assign({}, user, {password: undefined}); // mesma coisa do que fazer a linha de cima

    return userWithoutPass;
  }
}
