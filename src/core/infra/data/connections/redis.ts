import IORedis from "ioredis";

export default class Redis {
  private static connection?: IORedis.Redis;

  async getConnection(): Promise<IORedis.Redis> {
    if (!Redis.connection) {
      await this.openConnection();
    }
    return Redis.connection as IORedis.Redis;
  }

  async closeConnection(): Promise<void> {
    if (!Redis.connection) return;

    try {
      Redis.connection.disconnect();
      Redis.connection = undefined;
    } catch (error) {
      console.log("ERRO AO FECHAR A CONEXAO DO REDIS --> ", error);
      throw new Error("ERRO AO FECHAR A CONEXAO DO REDIS");
    }
  }

  async openConnection(): Promise<void> {
    if (Redis.connection) return;

    try {
      Redis.connection = new IORedis(process.env.REDISCLOUD_URL);
    } catch (error) {
      throw new Error(`ERRO AO CONECTAR NO REDIS -> ${error}`);
    }
  }
}
