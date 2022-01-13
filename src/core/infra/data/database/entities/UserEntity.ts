import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { ProfileDataEntity } from "./ProfileDataEntity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  uid!: string;

  @Column()
  login!: string;

  @Column()
  password!: string;

  @Column()
  enable!: boolean;

  @Column({ name: "uid_profile_data" })
  uidProfileData!: string;

  @Column({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "updated_at" })
  updatedAt!: Date;

  @OneToOne((_) => ProfileDataEntity)
  @JoinColumn({ name: "uid_profile_data", referencedColumnName: "uid" })
  profile!: ProfileDataEntity;

  @BeforeInsert()
  private beforeInsert() {
    this.uid = uuid();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  private beforeUpdate() {
    this.updatedAt = new Date();
  }
}
