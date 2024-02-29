import { cookies, headers } from 'next/headers';
import { Entities, getEm } from '../../_utils';
import is from 'typescript';
export interface ReqSessionParams {
  sessionId: string;
}
export function getReqSessionId(params: ReqSessionParams): string | undefined;
export function getReqSessionId(): string | undefined;
export function getReqSessionId(params?: ReqSessionParams) {
  console.log('getReqSessionId', params?.sessionId, headers().get('x-session-id'), cookies().get('sessionId')?.value);
  return params?.sessionId ?? headers().get('x-session-id') ?? cookies().get('sessionId')?.value;
}
import UserSession = Entities.UserSession.UserSession;
export async function EmFindCurrentSession(params?: ReqSessionParams) {
  const em = getEm();
  const sessionId = params ? getReqSessionId(params) : getReqSessionId();
  console.log('sessionId', sessionId);
  return em.findOne(UserSession, { sessionId });
}
export type UserSessionTypeKey = keyof typeof Entities.UserSession.UserSessionType;
export type UserSessionTag = `${typeof Entities.UserSession.UserSessionType[UserSessionTypeKey]}`;
export function isSessionOfType(session: UserSession, type: UserSessionTag | Entities.UserSession.UserSessionType) {
  return session.userType === type;
}

export const isCoachSession = (session: UserSession) => isSessionOfType(session, Entities.UserSession.UserSessionType.COACH);
export const isStudentSession = (session: UserSession) => isSessionOfType(session, Entities.UserSession.UserSessionType.STUDENT);

export const isGuestSession = (session: UserSession) => isSessionOfType(session, Entities.UserSession.UserSessionType.GUEST);
export function hasSessionUser(session: UserSession) : session is UserSession & { user: NonNullable<UserSession['user']> } {
  return !!session.user;
}
