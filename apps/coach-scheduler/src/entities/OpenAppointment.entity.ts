import { Entity, EntitySchema, ManyToOne, OneToOne } from '@mikro-orm/core';
import type { Rel } from '@mikro-orm/core';
import { CoachUser } from './Coach.entity';
import { Appointment } from './Appointment.entity';


@Entity()
export class CoachAppointment extends Appointment {
  @ManyToOne({ entity: () => CoachUser })
    coach!: Rel<CoachUser>;
}
