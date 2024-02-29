import { Collection, Entity, EntitySchema, OneToMany } from '@mikro-orm/core';
import { UserBaseEntity, UserType } from './User.entity';
import { CoachAppointment } from './OpenAppointment.entity';

@Entity({
  discriminatorValue: UserType.COACH,
})
export class CoachUser extends UserBaseEntity {
  @OneToMany({ entity: () => CoachAppointment, mappedBy: 'coach', orphanRemoval: true })
    appointments = new Collection<CoachAppointment>(this);

  @OneToMany(() => CoachAppointment, 'coach', { where: ['future', 'booked'] })
    upcomingAppointments = new Collection<CoachAppointment>(this);
}
