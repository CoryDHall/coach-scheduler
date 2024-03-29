import { NextApiRequest } from 'next';
import { cookies } from 'next/headers'
import { UserSession } from '../../..//entities/UserSession.entity';
import { jsonResponse } from '../_helpers/response';
import { Entities, getEm, withORM } from '../../_utils';
import { requestJson } from '../_helpers/requestJson';
import { ref, wrap } from '@mikro-orm/core';
import { getReqSessionId } from '../_helpers/getReqSessionId';
import { EmFindCurrentSession } from '../_helpers/getReqSessionId';

export const GET = withORM(async function Index(req: NextApiRequest) {
  const em = getEm();
  const foundSession = await EmFindCurrentSession();
  const userSession = foundSession ? Promise.resolve(foundSession) : (async () => {
    const session = new UserSession();
    await em.persistAndFlush(session);
    return session;
  })();
  const res = await jsonResponse(userSession, 'Error fetching session');
  res.headers.set('x-session-id', (await userSession).sessionId);
  res.headers.set('Set-Cookie', `sessionId=${(await userSession).sessionId}; Path=/; HttpOnly`);
  return res;
})

export const POST = withORM(async function Create(req: NextApiRequest) {
  const em = getEm();
  const params = await requestJson(req as unknown as Request);
  const foundSession = await EmFindCurrentSession(params);
  if (foundSession) {
    if (foundSession.user) {
      return jsonResponse(Promise.reject('Session already has user'), 'Session already has user');
    }
    const user = await em.findOneOrFail(Entities.User.UserBaseEntity, { email: params.email });
    const _newSession = new UserSession(ref(user), user.userType);
    wrap(foundSession, true).assign(_newSession);
    await em.flush();
    const res = await jsonResponse(Promise.resolve(foundSession), 'Error creating session');
    res.headers.set('Set-Cookie', `sessionId=${foundSession.sessionId}; Path=/; HttpOnly`);
    return res;
  }
  return jsonResponse(Promise.reject('Session not found'), 'Session not found');
})
