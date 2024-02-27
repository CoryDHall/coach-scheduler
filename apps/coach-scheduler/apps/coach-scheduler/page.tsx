import styles from './page.module.scss';

/* eslint-disable-next-line */
export interface CoachDashboardProps {}

export default function CoachDashboard(props: CoachDashboardProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to CoachDashboard!</h1>
    </div>
  );
}
