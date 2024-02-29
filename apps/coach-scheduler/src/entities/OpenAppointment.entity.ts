import { Entity, Filter, ManyToOne } from '@mikro-orm/core';
import type { Ref, Rel } from '@mikro-orm/core';
import { CoachUser } from './Coach.entity';
import { Appointment } from './Appointment.entity';
import { StudentUser } from './Student.entity';


@Entity()
@Filter({ name: 'openSlots', cond: { student: null } })
@Filter({ name: 'booked', cond: { student: { $ne: null } } })
export class CoachAppointment extends Appointment {
  @ManyToOne({ entity: () => CoachUser })
    coach!: Rel<CoachUser>;


  @ManyToOne({
    entity: () => StudentUser ,
    nullable: true,
    eager: false,
    lazy: true,
    ref: true,
    updateRule: 'set null',
  })
    student?: Ref<StudentUser>;
}
