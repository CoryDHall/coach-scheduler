import { Entities } from '../_utils';
import { getReqSessionId } from '../api/_helpers/getReqSessionId';
import { SchedulerProvider } from './Scheduler';
import { getXHeaderUrl } from './getXHeaderUrl';
interface SchedulerContextProps {
  children: React.ReactNode;
  user: Entities.User.UserBaseEntity;
}

export async function SchedulerContext({ children, user }: SchedulerContextProps) {
  const url = getXHeaderUrl();
  url.pathname = '/api/appointments';
  const sessId = getReqSessionId();

  return (
    <SchedulerProvider url={url.href} sessionId={sessId}>
      {children}
    </SchedulerProvider>
  );
}
