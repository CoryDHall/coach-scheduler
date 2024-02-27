import { EntitySchema } from '@mikro-orm/core';
import { CoachUser } from './Coach.entity';
import { StudentUser } from './Student.entity';

export enum UserType {
  COACH = 'coach',
  STUDENT = 'student',
  GUEST = 'guest', // not logged in
}

export type UserUserType = {
  [UserType.COACH]: CoachUser;
  [UserType.STUDENT]: StudentUser;
  [UserType.GUEST]: null;
};
export interface UserSession{
  id: number;
  userId: number;

  userType: UserType;
}

export const schema = new EntitySchema<UserSession>({
  name: 'UserSession',
  properties: {
    id: { type: 'number', primary: true },
    userId: { type: 'number' },
    userType: { type: 'string' },
  },
});
