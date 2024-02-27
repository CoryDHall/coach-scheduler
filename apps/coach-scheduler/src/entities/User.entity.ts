import { Entity, EntitySchema, Enum, Index, Property } from '@mikro-orm/core';
import { BaseEntity } from './Base.entity';

export enum UserType {
  COACH= 'coach',
  STUDENT = 'student',
}

@Entity({
  discriminatorColumn: 'userType',
  abstract: true,
  tableName: 'users',
})
export class UserBaseEntity extends BaseEntity {
  @Property({ unique: true })
  @Index()
    email!: string;

  @Property()
    username!: string;

  @Enum({ items: () => UserType, nativeEnumName: 'user_type' })
    userType!: UserType;
}
