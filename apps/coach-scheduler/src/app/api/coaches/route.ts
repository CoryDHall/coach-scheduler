import { NextApiRequest, NextApiResponse } from 'next';
import { jsonResponse } from '../_helpers/response';
import { CoachAppointment } from '../../../entities/OpenAppointment.entity';
import { requestJson } from '../_helpers/requestJson';
import { Entities, getEm, withORM } from '../../_utils';


import CoachUser = Entities.CoachUser.CoachUser;
async function Index(_req: NextApiRequest) {
  const em = getEm();
  const repo = em.getRepository(CoachUser);
  const query = repo.findAll({
    populate: ['appointments', 'upcomingAppointments'],
  });
  return jsonResponse(query, 'Error fetching coaches');
}

export const GET = withORM(Index);

async function Create(req: NextApiRequest) {
  const em = getEm();
  const repo = em.getRepository(CoachUser);
  const reqData = await requestJson(req as unknown as Request);
  console.log('coach', reqData);
  const coach = repo.create(reqData);
  return jsonResponse(
    em.persistAndFlush(coach).then(() => {
      return coach;
    }), 'Error creating coach');
}

export const POST = withORM(Create);
