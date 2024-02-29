import type { NextApiRequest } from 'next';
import { Entities, getEm, withORM } from '../../_utils';
import { EmFindCurrentSession, hasSessionUser, isCoachSession } from '../_helpers/getReqSessionId';
import { jsonResponse } from '../_helpers/response';

import Appt = Entities.Appointment;
import { Ref, ref, rel, wrap } from '@mikro-orm/core';
import { requestJson } from '../_helpers/requestJson';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

/**
  * @brief Create an open appointment
  * @detail Coach users can create open appointments for students to book
  * */
export const POST = withORM(async function Create(req: NextApiRequest) {
  const currentSession = await EmFindCurrentSession();
  if (!currentSession) {
    return jsonResponse(Promise.reject('Session not found'), 'Session not found');
  }
  if (!isCoachSession(currentSession)) {
    return jsonResponse(Promise.reject('Session not of type coach'), 'Session not of type coach');
  }
  if (!hasSessionUser(currentSession)) {
    return jsonResponse(Promise.reject('Session has no user'), 'Session has no user');
  }
  const em = getEm();
  const reqParams = await requestJson(req as unknown as Request);
  const startsAt = new Date(reqParams.startsAt);
  if (isNaN(startsAt.getTime())) {
    return jsonResponse(Promise.reject('Invalid start time'), 'Invalid start time');
  }
  if (startsAt < new Date()) {
    return jsonResponse(Promise.reject('Start time in the past'), 'Start time in the past');
  }
  const apptWindow = Appt.getTimeWindowWithDuration(startsAt, /** 2 Hours */ 2 * 60 * 60 * 1000);
  console.log('apptWindow', apptWindow);
  const coach = await em.findOne(Entities.CoachUser.CoachUser, currentSession.user.id);
  const newAppt = new Entities.OpenAppointment.CoachAppointment(apptWindow);
  newAppt.coach = coach!;
  console.log('newAppt', newAppt, newAppt.student);
  delete newAppt.student;

  coach?.appointments.add(newAppt);

  await em.flush();
  return jsonResponse(Promise.resolve(newAppt), 'Error creating appointment');
})

export const GET = withORM(async function Index(req: NextRequest) {
  const currentSession = await EmFindCurrentSession();
  if (!currentSession) {
    return jsonResponse(Promise.reject('Session not found'), 'Session not found');
  }
  if (!hasSessionUser(currentSession)) {
    return jsonResponse(Promise.reject('Session has no user'), 'Session has no user');
  }
  const qPage = getQParamInt(req.nextUrl.searchParams.get('page'));
  const qPageSize = getQParamInt(req.nextUrl.searchParams.get('pageSize'), '10');
  const em = getEm();
  if (isCoachSession(currentSession)) {
    const coach = await em.findOne(Entities.CoachUser.CoachUser, { id: currentSession.user.id }, { populate: ['appointments'],
      filters: {
        appointments: { between: (() => {
          const d = new Date();
          d.setDate(d.getDate() + qPage * qPageSize);
          const e = new Date(d);
          e.setDate(d.getDate() + qPageSize);
          return [d, e];
        })() },
      } });
    return jsonResponse(Promise.resolve(coach?.appointments), 'Error fetching appointments');
  }
})
function getQParamInt(page: string | string[] | null | undefined, def = '0') {
  return parseInt(Array.isArray(page) ? page[0] : page ?? def);
}
