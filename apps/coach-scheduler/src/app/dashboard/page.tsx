import styles from './page.module.scss';
import { headers } from 'next/headers'
import { UpcomingAppointmentsView } from './UpcomingAppointmentsView';
import { SchedulerContext } from './SchedulerContext';
import { Scheduler } from './Scheduler';
import { getXHeaderUrl } from './getXHeaderUrl';

export default async function Dashboard() {
  const url = getXHeaderUrl();
  url.pathname = `/api/coaches/${headers().get('x-user-id')}`;
  const res = await fetch(url);
  const user = await res.json();
  console.log('dashboard\t', user);

  return (
    <div className={styles.page}>
      <header>
        <h1>Hi {user.userType === 'coach' && 'Coach'} {user.username}</h1>
      </header>
      <section className={styles.dashboard_section}>
        <header>
          <h2>Upcoming appointments</h2>
        </header>
        <UpcomingAppointmentsView appointments={user.upcomingAppointments} />
      </section>
      <section className={[styles.dashboard_section, styles.scheduler_container].join(' ')}>
        <header>
          <h2>Your Availability</h2>
        </header>
        <SchedulerContext user={user}>
          <Scheduler/>
        </SchedulerContext>
      </section>
    </div>
  );
}
