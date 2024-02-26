import { EntitySchema } from "@mikro-orm/core";

import { CoachUser } from "./Coach.entity";
import { Appointment, schema as AppointmentSchema } from "./Appointment.entity";
/// @ts-expect-error - partial schema
export class OpenAppointment implements Appointment {
  coach?: CoachUser;
}

export const schema = new EntitySchema<OpenAppointment, Appointment>({
  class: OpenAppointment,
  extends: AppointmentSchema,
  properties: {
    coach: {
      kind: "m:1",
      entity: () => "CoachUser",
      inversedBy: "OpenSlots",
    }
  },
});
