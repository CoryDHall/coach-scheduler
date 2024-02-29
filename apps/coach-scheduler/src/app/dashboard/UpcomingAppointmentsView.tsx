import { Entities } from '../_utils';

export interface UpcomingAppointmentsViewProps {
  appointments: Entities.OpenAppointment.CoachAppointment[];
}
export function UpcomingAppointmentsView({ appointments }: UpcomingAppointmentsViewProps) {
  return (
    <div>
      {appointments.map((data) => (<UAppointmentView data={data} key={data.id}/>))}
    </div>
  );
}

interface UAppintmentView {
  data: Entities.OpenAppointment.CoachAppointment;
}

function UAppointmentView(props: UAppintmentView) {
  const { data } = props;
  return (
    <div>
      {data.student?.username}
      @<span>{data.beginAt.toLocaleString()}</span>
    </div>
  );
}
