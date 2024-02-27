import { Collection, Entity, EntitySchema } from '@mikro-orm/core';
import { UserBaseEntity, UserType } from './User.entity';

@Entity({ discriminatorValue: UserType.STUDENT })
export class StudentUser extends UserBaseEntity {
}
