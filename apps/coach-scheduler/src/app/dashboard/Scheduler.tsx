'use client';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import style from './page.module.scss';

export interface SchedulerContextObj {
  apiUrl: string;
  sessionId?: string;
  page: number;
  pageSize: number;
  hourDivisions: number;
  appointmentLength: number;
}
export const Ctx = React.createContext({
  apiUrl: '',
  page: 0,
  pageSize: 5,
  hourDivisions: 4,
} as SchedulerContextObj)

type SchedulerProviderProps = {
  children: React.ReactNode;
  url: SchedulerContextObj['apiUrl'];
  sessionId: SchedulerContextObj['sessionId'];
};

export function SchedulerProvider({ children, url }: SchedulerProviderProps) {
  const [page, setPage] = React.useState(0);
  const incPage = useCallback(() => setPage((p => (p+1))), []);
  const decPage = useCallback(() => setPage(p => (p - (+(p > 0)))), []);
  return (
    <Ctx.Provider value={{ apiUrl: url, page, pageSize: 5, hourDivisions: 4, appointmentLength: 2 }}>
      <SchedulerNavigation onNext={incPage} onPrev={decPage} />
      {children}
    </Ctx.Provider>);
}
export function Scheduler() {
  const { apiUrl, page, pageSize } = useContext(Ctx);
  const [data, setData] = React.useState([] as any[]);
  useEffect(() => {
    const url = new URL(apiUrl);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());
    console.log('fetching', url.href);
    fetch(url.href, {
    }).then(res => res.json()).then(setData);
  }, [apiUrl, page, pageSize])
  const { ref: gridRef, dim } = useSchedulerDayGrid();

  return (
    <div ref={gridRef} className={style.schedule_grid__container}>
      <ScheduleGrid dim={dim}>
        {data.map((d, i) => <OpenedAppt key={i} {...{ ...d }} cellWidth={dim.cellWidth} cellHeight={dim.cellHeight}></OpenedAppt>)}
      </ScheduleGrid>
    </div>
  );
}
interface OpenedApptProps {
  beginAt: Date;
  endAt: Date;
  cellWidth: number;
  cellHeight: number;
}

function OpenedAppt(props: OpenedApptProps) {
  const { beginAt, endAt, cellWidth, cellHeight } = props;
  const bDate = new Date(beginAt);
  const begin = useSchedulerPosition(bDate);
  const eDate = new Date(endAt);
  const end = useSchedulerPosition(eDate);
  const { pageSize, hourDivisions } = useContext(Ctx);
  console.log('opened appt', begin, end, pageSize, hourDivisions, bDate, eDate, beginAt, endAt, cellHeight)

  return (
    <div className={style.opened_appt} style={{
      transform: `translate(${begin.x * cellWidth}px, ${begin.y * cellHeight * hourDivisions}px)`,
      width: `${100 / pageSize}%`,
      height: `${100 / ((end.y - begin.y) * hourDivisions)}%`,
    }} >
      {bDate.toLocaleTimeString()} - {eDate.toLocaleTimeString()}
    </div>
  );
}
interface SchedulerNavigationProps {
  onNext: () => void;
  onPrev: () => void;
}
function SchedulerNavigation(props: SchedulerNavigationProps) {
  const { onNext, onPrev } = props;
  const { page, pageSize } = useContext(Ctx);
  const beginDate = useScheduleDateFromPosition(0, 0)
  const endDate = useScheduleDateFromPosition(pageSize - 1, 0)
  return (
    <nav>
      <button onClick={onPrev} disabled={page === 0}>Previous</button>
      <span>{beginDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
      <button onClick={onNext}>Next</button>
    </nav>
  );
}
interface ScheduleGridProps {
  children: React.ReactNode;
  dim: GridDef;
}
function ScheduleGrid(props: ScheduleGridProps) {
  const { children, dim } = props;
  const { pageSize, hourDivisions } = useContext(Ctx);
  const slots = pageSize * 24 * hourDivisions;

  return (
    <div>
      <div style={{ position: 'relative', width: dim.width, height: dim.height }}>
        {useMemo(() => {
          const gridSlots = new Array(slots).fill(0).map((_, i) => i);
          return gridSlots.map(i => <AppointmentSlot key={i} index={i} />);
        }, [slots, dim.width, dim.height])}
      </div>
      <ScheduleCursor dim={dim}>
        {children}
      </ScheduleCursor>
    </div>
  );
}

function ScheduleCursor(props: ScheduleGridProps) {
  const { children, dim: { width, height, cellHeight, cellWidth } } = props;
  const ref = React.createRef<HTMLDivElement>();
  const [hoverCol, setHoverCol] = React.useState(-1);
  const [hoverRow, setHoverRow] = React.useState(-1);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setHoverCol(Math.floor(offsetX / cellWidth));
    setHoverRow(Math.floor(offsetY / cellHeight));
  }
  , [cellHeight, cellWidth]);
  const { pageSize, hourDivisions, appointmentLength, apiUrl } = useContext(Ctx);
  const onMouseExit = useCallback(() => {
    setHoverRow(v => (v < 12 * hourDivisions ? (-appointmentLength * hourDivisions) : (24 * hourDivisions)));
  }, [appointmentLength, hourDivisions]);
  const cellTime = useScheduleDateFromPosition(hoverCol, hoverRow);
  const onDblClick = useCallback(() => {
    console.log('dbl click', cellTime);
    fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify({ startsAt: cellTime }),
    }).then(res => res.json()).then(console.log);
  }, [cellTime]);

  return (
    <div ref={ref} className={style.schedule_cursor__container} onMouseMove={onMouseMove} onMouseLeave={onMouseExit} onDoubleClick={onDblClick}>
      {children}
      <i className={style.schedule_cursor} style={{
        transform: `translate(${hoverCol * cellWidth}px, ${hoverRow * cellHeight}px)`,
        width: `${100 / pageSize }%`,
        height: `${appointmentLength * 100 / (24) }%`,
      }}>{cellTime.toLocaleTimeString()}</i>
      <i className={style.schedule_cursor} style={{
        transform: `translate(${(hoverCol + 1) * cellWidth}px, ${(hoverRow - (24 * hourDivisions)) * cellHeight}px)`,
        width: `${100 / pageSize}%`,
        height: `${appointmentLength * 100 / (24)}%`,
      }}/>
    </div>
  )
}
interface GridDef {
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
}

function useSchedulerDayGrid() {
  const { pageSize, hourDivisions } = useContext(Ctx);

  const [dim, setDim] = React.useState({ width: 0, height: 0, cellWidth: 0, cellHeight: 0 } as GridDef);
  const ref = React.createRef<HTMLDivElement>();
  const dW = dim.width;
  const dH = dim.height;
  useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      if (width === dW && height === dH) return;
      setDim({ width, height, cellWidth: width / pageSize, cellHeight: height / (24 * hourDivisions) });
    }
  }, [hourDivisions, pageSize, ref, dW, dH]);
  return { ref, dim };
}

type AppointmentSlotProps = {
  index: number;
};

function AppointmentSlot({ index }: AppointmentSlotProps) {
  const { pageSize, hourDivisions } = useContext(Ctx);
  const x = Math.floor(index / (24 * hourDivisions));
  const y = index % (24 * hourDivisions);
  const isHour = (index % hourDivisions) === 0;
  return (
    <div className={style.appt_slot} style={{
      ...x === 0 ? { borderLeft: '' } : {},
      ...x !== (pageSize - 1) ? { borderRight: '' } : {},
      opacity: isHour ? 0.7 : 0.3,
      top: `${y * 100 / (24 * hourDivisions) }%`,
      left: `${(100 / pageSize) * x }%`,
      height: `${100 / (24 * hourDivisions) }%`,
      width: `${100 / pageSize }%` }}/>
  );
}


function useSchedulerPosition(date: Date) {
  const { page, pageSize, hourDivisions } = useContext(Ctx);
  const zeroDate = new Date();
  zeroDate.setHours(0, 0, 0, 0);
  zeroDate.setDate(zeroDate.getDate() + page * pageSize);
  const dayDate = new Date(date);
  dayDate.setHours(0, 0, 0, 0);
  const day = (dayDate.getTime() - zeroDate.getTime()) / (24 * 60 * 60 * 1000);
  const hour = date.getHours();
  const min = date.getMinutes();
  const x = day;
  const y = (hour + min / 60);
  return { x, y, zeroDate };
}

function useScheduleDateFromPosition(col: number, row: number) {
  const { page, pageSize, hourDivisions } = useContext(Ctx);
  const date = new Date();
  date.setDate(date.getDate() + page * pageSize + col);
  const h = row / hourDivisions;
  date.setHours(h);
  date.setMinutes((h - Math.floor(h)) * 60, 0, 0);
  return date;
}
