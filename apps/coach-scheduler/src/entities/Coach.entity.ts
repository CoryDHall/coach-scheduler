import { Collection, EntitySchema } from "@mikro-orm/core";
import { UserBaseEntity, schema as UserSchema } from "./User.entity";
import { OpenAppointment } from "./OpenAppointment.entity";
/// @ts-expect-error - partial schema
export class CoachUser implements UserBaseEntity {
  OpenSlots = new Collection<OpenAppointment>(this);
}

export const schema = new EntitySchema<CoachUser, UserBaseEntity>({
  class: CoachUser,
  extends: UserSchema,
  properties: {
    OpenSlots: {
      kind: "1:m",
      entity: () => "OpenAppointment",
      mappedBy: slot => slot.coach,

    },
  },
});
