import { EntitySchema } from "@mikro-orm/core";


export type TimeWindow = [beginAt: Date, endAt: Date];

export interface Appointment {
  id: number;
  beginAt: Date;
  endAt: Date;
}

export const schema = new EntitySchema<Appointment>({
  name: "Appointment",
  abstract: true,
  properties: {
    id: { type: "number", primary: true },
    beginAt: { type: "date" },
    endAt: { type: "date" },
  },
});
