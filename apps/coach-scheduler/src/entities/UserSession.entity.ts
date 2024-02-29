import { Entity, Enum, Index, ManyToOne, Property, Unique, ref } from '@mikro-orm/core';
import type { Ref } from '@mikro-orm/core';
import { CoachUser } from './Coach.entity';
import { StudentUser } from './Student.entity';
import { UserBaseEntity } from './User.entity';
import { BaseEntity } from './Base.entity';

export enum UserSessionType {
  GUEST = 'guest', // not logged in
  COACH = 'coach',
  STUDENT = 'student',
}

@Entity()
export class UserSession extends BaseEntity {
  @Enum({
    items: () => UserSessionType,
    nativeEnumName: 'user_session_type',
    default: UserSessionType.GUEST,
  })
    userType!: UserSessionType;

  @ManyToOne({
    entity: () =>UserBaseEntity,
    nullable: true,
    ref: true,
  })
    user?: Ref<UserBaseEntity>;

  @Property({
    hidden: true,
    type: 'uuid',
    defaultRaw: 'gen_random_uuid()',
  })
  @Unique()
  @Index()
    sessionId!: string;

  /// @brief Coach sign-in constructor
  constructor(user: Ref<CoachUser>, userType: UserSessionType.COACH);
  /// @brief Student sign-in constructor
  constructor(user: Ref<StudentUser>, userType: UserSessionType.STUDENT);
  /// @brief Guest constructor
  constructor();
  constructor(user?: Ref<CoachUser> | Ref<StudentUser>, userType?: UserSessionType) {
    super();
    if (user) {
      this.user = ref(user);
    }
    this.userType = userType ?? UserSessionType.GUEST;
  }
}
