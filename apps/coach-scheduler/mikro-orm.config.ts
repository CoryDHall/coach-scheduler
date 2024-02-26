import { defineConfig } from "@mikro-orm/postgresql";
import { CoachUser } from "./src/entities/Coach.entity";
import { OpenAppointment } from "./src/entities/OpenAppointment.entity";

export default defineConfig({
  dbName: "coach-scheduler",
  entitiesTs: ["src/entities/**/*.entity.ts"],
  entities: [CoachUser, OpenAppointment],
  debug: true,
});
