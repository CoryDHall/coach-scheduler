import { Entity, Filter, Property } from '@mikro-orm/core';
import { BaseEntity } from './Base.entity';


export type TimeWindow = [beginAt: Date, endAt: Date];

export function isTimeWindow(value: unknown): value is TimeWindow {
  return (
    value instanceof Array &&
    value.length === 2 &&
    value.every((v) => v instanceof Date)
  );
}

export function durationOfTimeWindow([beginAt, endAt]: TimeWindow): number {
  return endAt.getTime() - beginAt.getTime();
}

export function getTimeWindowWithDuration(tw: TimeWindow, duration: number): TimeWindow;
export function getTimeWindowWithDuration(beginAt: Date, duration: number): TimeWindow;
export function getTimeWindowWithDuration(
  twOrBeginAt: TimeWindow | Date,
  duration: number,
): TimeWindow {
  let beginAt: Date;
  if (isTimeWindow(twOrBeginAt)) {
    beginAt = twOrBeginAt[0];
  } else {
    beginAt = twOrBeginAt;
  }
  return [beginAt, new Date(beginAt.getTime() + duration)];
}

@Entity({ abstract: true })
@Filter({ name: 'future', cond: { beginAt: { $gte: 'now()' } } })
@Filter({ name: 'past', cond: { endAt: { $lt: 'now()' } } })
@Filter({ name: 'current', cond: { beginAt: { $lte: 'now()' }, endAt: { $gte: 'now()' } } })
@Filter({
  name: 'between',
  cond: args => ({ beginAt: { $gte: args.timeWindow[0] }, endAt: { $lte: args.timeWindow[1] } }),
})
export abstract class Appointment extends BaseEntity {
  @Property({ })
    beginAt!: Date;

  @Property({ check: '("beginAt" < "endAt")' })
    endAt!: Date;

  get timeWindow(): TimeWindow {
    return [this.beginAt, this.endAt];
  }
  set timeWindow([beginAt, endAt]: TimeWindow) {
    this.beginAt = beginAt;
    this.endAt = endAt;
  }

  constructor(timeWindow: TimeWindow);
  constructor(beginAt: Date, duration: number);
  constructor(
    twOrBeginAt: TimeWindow | Date,
    duration?: number,
  ) {
    super();
    if (isTimeWindow(twOrBeginAt)) {
      this.timeWindow = twOrBeginAt;
    } else if (duration !== undefined) {
      this.timeWindow = getTimeWindowWithDuration(twOrBeginAt, duration);
    }
  }
}
