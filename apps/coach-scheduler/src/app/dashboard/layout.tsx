import { redirect } from 'next/navigation';
import { UserSessionType } from '../../entities/UserSession.entity';

function SessionHandler() {
  let sessionId: string | null = null;
  return [
    () => (sessionId ?? ''),
    (newSessionId: string | null) => (void (sessionId = newSessionId)),
  ] as const;
}
export const [getSessionId, setSessionId] = SessionHandler();
export default async function DashboardLayout({ children } : { children: React.ReactNode; }) {
  return (
    <main>
      {children}
    </main>
  )
}
