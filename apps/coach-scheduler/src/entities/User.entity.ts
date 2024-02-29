import { Collection, Entity, EntitySchema, Enum, Index, OneToMany, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './Base.entity';
import { UserSession } from './UserSession.entity';

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

  @Property({
    hidden: true,
    lazy: true,
    generated: cols => `(encode(digest(${(cols as UserBaseEntity).email}, 'sha256'), 'hex')) stored` })
  @Unique()
  readonly identityHash!: string;

  @OneToMany({ entity: () => UserSession, mappedBy: obj => obj.user })
    sessions = new Array<UserSession>();

}
