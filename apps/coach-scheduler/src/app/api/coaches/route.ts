import { CoachUser } from '../../../entities/Coach.entity';
import { UserSession, UserType } from '../../../entities/UserSession.entity';
import getEm from '../../../utils/getEm';
import withORM from '../../../utils/withORM';
import { NextApiRequest, NextApiResponse } from 'next';
import { jsonResponse } from '../_helpers/response';
import { CoachAppointment } from '../../../entities/OpenAppointment.entity';

async function Index(_req: NextApiRequest) {
  const em = getEm();
  const repo = em.getRepository(CoachUser);
  const query = repo.findAll({
    populate: ['appointments'],
  });
  return jsonResponse(query, 'Error fetching coaches');
}

export const GET = withORM(Index);

async function Create(req: NextApiRequest) {
  const em = getEm();
  const repo = em.getRepository(CoachUser);
  const reqData = await (req as unknown as Response).json();
  console.log('coach', reqData);
  const coach = repo.create(reqData);
  return jsonResponse(
    em.persistAndFlush(coach).then(() => {
      return coach;
    }), 'Error creating coach');
}

export const POST = withORM(Create);
