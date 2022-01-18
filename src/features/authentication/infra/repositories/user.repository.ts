import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { ProfileDataEntity } from "../../../../core/infra/data/database/entities/ProfileDataEntity";
import { UserEntity } from "../../../../core/infra/data/database/entities/UserEntity";
import { User } from "../../domain/models/user";

interface UserParams {
  name: string;
  email: string;
  document: string;
  phone: string;
  hashPassword: string;
}

export class UserRepository {
  async getUserByLogin(login: string): Promise<User | undefined> {
    const user = await UserEntity.findOne({
      where: {
        login,
      },
      relations: ["profile"],
    });

    if (!user) return undefined;

    return {
      uid: user.uid,
      password: user.password,
      enable: user.enable,
      name: user.profile.name,
      document: user.profile.document,
      phone: user.profile.phone,
      uidProfile: user.profile.uid,
      email: user.profile.email,
    };
  }

  async verifyUserAlreadExistsByEmail(email: string): Promise<boolean> {
    // procura o usuário pelo e-mail na base de dados
    const user = await UserEntity.findOne({
      where: { login: email },
    });

    if (!user) return false;

    return true;
  }

  async verifyUserAlreadyExistsByDocument(document: string): Promise<boolean> {
    // procura o usuário pelo documento (cpf, cnpj) na base dados

    const userDocument = await ProfileDataEntity.findOne({
      where: {
        document,
      },
    });

    if (!userDocument) return false;

    return true;
  }

  @Transaction()
  async createUser(
    userParams: UserParams,
    @TransactionManager() transaction?: EntityManager
  ): Promise<User> {
    transaction = transaction as EntityManager;
    // transaction?.clear(UserEntity);
    // UserEntity.clear();

    // cria o profile e salva no banco
    const profile = transaction.create(ProfileDataEntity, {
      email: userParams.email,
      document: userParams.document,
      phone: userParams.phone,
      name: userParams.name,
    });

    await transaction.save(profile);

    // cria o user e salva no banco
    const user = transaction.create(UserEntity, {
      login: userParams.email,
      enable: true,
      password: userParams.hashPassword,
      uidProfileData: profile.uid,
    });

    await transaction.save(user);

    return {
      uid: user.uid,
      uidProfile: profile.uid,
      name: profile.name,
      email: profile.email,
      document: profile.document,
      enable: user.enable,
      phone: profile.phone,
    };
  }
}
