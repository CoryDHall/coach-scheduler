import { NextApiRequest, NextApiResponse } from 'next';
import { Entities, getEm, withORM } from '../../../_utils';
import type { NextRequest } from 'next/server';

import CoachUser = Entities.CoachUser.CoachUser;
import { jsonResponse } from '../../_helpers/response';
export const GET = withORM(async function ShowCoach(req: NextApiRequest, res: NextApiResponse) {
  const em = getEm();
  const repo = em.getRepository(CoachUser);

  const routeParams = (res as any).params;
  console.log('get coach', ...Object.entries( routeParams ), routeParams, res);
  const coach = repo.findOne( routeParams, {
    populate: ['upcomingAppointments'],
  } );
  return jsonResponse(coach, `Coach not found with ID=${routeParams.id}`)
});
