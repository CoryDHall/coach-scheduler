import { Collection, Entity, EntitySchema, OneToMany } from '@mikro-orm/core';
import { UserBaseEntity, UserType } from './User.entity';
import { CoachAppointment } from './OpenAppointment.entity';

@Entity({ discriminatorValue: UserType.STUDENT })
export class StudentUser extends UserBaseEntity {
  @OneToMany({ entity: () => CoachAppointment, mappedBy: 'student' })
    appointments = new Collection<CoachAppointment>(this);
}
