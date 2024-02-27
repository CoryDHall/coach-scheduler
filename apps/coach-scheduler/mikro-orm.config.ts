import { defineConfig } from '@mikro-orm/postgresql';
import { CoachUser } from './src/entities/Coach.entity';
import { CoachAppointment } from './src/entities/OpenAppointment.entity';
import { StudentUser } from './src/entities/Student.entity';
import { UserSession } from './src/entities/UserSession.entity';
import { Appointment } from './src/entities/Appointment.entity';
import { UserBaseEntity } from './src/entities/User.entity';

export default defineConfig({
  dbName: 'coach-scheduler',
  entitiesTs: ['src/entities/**/*.entity.ts'],
  entities: [
    UserBaseEntity,
    CoachUser,
    StudentUser,
    CoachAppointment,
  ],
  debug: true,
});
