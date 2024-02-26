import { EntitySchema } from "@mikro-orm/core";

export interface UserBaseEntity {
  id: number;
  email: string;
  username: string;
}

export const schema = new EntitySchema<UserBaseEntity>({
  name: "UserBaseEntity",
  abstract: true,
  properties: {
    id: { type: "number", primary: true },
    email: { type: "string" },
    username: { type: "string" },
  },
});
