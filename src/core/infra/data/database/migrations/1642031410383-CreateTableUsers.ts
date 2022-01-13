import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTableUsers1642031410383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "uid",
            type: "UUID",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "login",
            type: "varchar",
            length: "100",
            isNullable: false,
          },
          {
            name: "password",
            type: "text",
            isNullable: false,
          },
          {
            name: "enable",
            type: "bool",
            isNullable: false,
            default: true,
          },
          {
            name: "uid_profile_data",
            type: "UUID",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: false,
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: false,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_users_profile_data",
            columnNames: ["uid_profile_data"],
            referencedTableName: "profile_data",
            referencedColumnNames: ["uid"],
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users", true, true, true);
  }
}
