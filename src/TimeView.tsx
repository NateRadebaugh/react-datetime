import * as React from "react";
import dayjs, { Dayjs } from "dayjs";

import { TimeConstraint, TimeConstraints, ViewMode } from "./.";

const allCounters: Array<"hours" | "minutes" | "seconds" | "milliseconds"> = [
  "hours",
  "minutes",
  "seconds",
  "milliseconds"
];

const defaultTimeConstraints: AlwaysTimeConstraints = {
  hours: {
    min: 0,
    max: 23,
    step: 1
  },
  minutes: {
    min: 0,
    max: 59,
    step: 1
  },
  seconds: {
    min: 0,
    max: 59,
    step: 1
  },
  milliseconds: {
    min: 0,
    max: 999,
    step: 1
  }
};

interface TimePartInterface {
  showPrefix?: boolean;
  onUp: () => void;
  onDown: () => void;
  value: string | undefined;
}

const TimePart = (props: TimePartInterface) => {
  const { showPrefix, onUp, onDown, value } = props;

  return value !== null && value !== undefined ? (
    <React.Fragment>
      {showPrefix && <div className="rdtCounterSeparator">:</div>}
      <div className="rdtCounter">
        <span className="rdtBtn" onMouseDown={onUp}>
          ▲
        </span>
        <div className="rdtCount">{value}</div>
        <span className="rdtBtn" onMouseDown={onDown}>
          ▼
        </span>
      </div>
    </React.Fragment>
  ) : null;
};

interface AlwaysTimeConstraints {
  hours: TimeConstraint;
  minutes: TimeConstraint;
  seconds: TimeConstraint;
  milliseconds: TimeConstraint;
}

function getStepSize(
  type: "hours" | "minutes" | "seconds" | "milliseconds",
  timeConstraints?: TimeConstraints
) {
  let step = defaultTimeConstraints[type].step;
  const config = timeConstraints ? timeConstraints[type] : undefined;
  if (config && config.step) {
    step = config.step;
  }

  return step;
}

function change(
  op: "add" | "sub",
  type: "hours" | "minutes" | "seconds" | "milliseconds",
  timestamp: Date,
  timeConstraints?: TimeConstraints
): Date {
  const timestampDayJs = dayjs(timestamp);
  const mult = op === "sub" ? -1 : 1;

  const step = getStepSize(type, timeConstraints) * mult;
  if (type === "hours") {
    return timestampDayJs.add(step, "hour").toDate();
  } else if (type === "minutes") {
    return timestampDayJs.add(step, "minute").toDate();
  } else if (type === "seconds") {
    return timestampDayJs.add(step, "second").toDate();
  } else {
    return timestampDayJs.add(step, "millisecond").toDate();
  }
}

function getFormatted(
  type: "hours" | "minutes" | "seconds" | "milliseconds" | "daypart",
  timestamp: Dayjs,
  timeFormat?: string | false
) {
  const fmt = typeof timeFormat === "string" ? timeFormat : "";

  function has(f: string, val: string) {
    return f.indexOf(val) !== -1;
  }

  const hasHours = has(fmt.toLowerCase(), "h");
  const hasMinutes = has(fmt, "m");
  const hasSeconds = has(fmt, "s");
  const hasMilliseconds = has(fmt, "S");

  const hasDayPart = has(fmt, "A");

  const typeFormat =
    type === "hours" && hasHours
      ? hasDayPart
        ? "h"
        : "H"
      : type === "minutes" && hasMinutes
      ? "mm"
      : type === "seconds" && hasSeconds
      ? "ss"
      : type === "milliseconds" && hasMilliseconds
      ? "SSS"
      : type === "daypart" && hasDayPart
      ? "A"
      : undefined;

  if (typeFormat) {
    return timestamp.format(typeFormat);
  }

  return undefined;
}

function toggleDayPart(
  timestamp: Dayjs,
  setSelectedDate: (newDate: Dayjs) => void
) {
  return () => {
    const hours = timestamp.get("hour");
    const newHours = hours >= 12 ? hours - 12 : hours + 12;

    setSelectedDate(timestamp.set("hour", newHours));
  };
}

let timer;
let increaseTimer;
let mouseUpListener: () => void;

function onStartClicking(
  op: "add" | "sub",
  type: "hours" | "minutes" | "seconds" | "milliseconds",
  props
) {
  return () => {
    const {
      readonly,
      viewTimestamp: origViewTimestamp = new Date(),
      timeConstraints,
      setViewTimestamp,
      setSelectedDate
    } = props;
    if (!readonly) {
      let viewTimestamp = change(op, type, origViewTimestamp, timeConstraints);
      setViewTimestamp(viewTimestamp);

      timer = setTimeout(() => {
        increaseTimer = setInterval(() => {
          viewTimestamp = change(op, type, viewTimestamp, timeConstraints);
          setViewTimestamp(viewTimestamp);
        }, 70);
      }, 500);

      mouseUpListener = () => {
        clearTimeout(timer);
        clearInterval(increaseTimer);
        setSelectedDate(viewTimestamp);
        document.body.removeEventListener("mouseup", mouseUpListener);
        document.body.removeEventListener("touchend", mouseUpListener);
      };

      document.body.addEventListener("mouseup", mouseUpListener);
      document.body.addEventListener("touchend", mouseUpListener);
    }
  };
}

export interface TimeViewProps {
  viewTimestamp: Dayjs;
  dateFormat: string | false;
  setViewMode: (newViewMode: ViewMode) => void;
  timeFormat: string | false;
  setSelectedDate: (newDate: Dayjs) => void;
}

function TimeView(props: TimeViewProps) {
  const {
    viewTimestamp = dayjs(),
    dateFormat = false,
    setViewMode,
    timeFormat = "h:mm A",
    setSelectedDate
  } = props;

  let numCounters = 0;

  return (
    <div className="rdtTime">
      <table>
        {dateFormat ? (
          <thead>
            <tr>
              <th
                className="rdtSwitch"
                colSpan={4}
                onClick={() => setViewMode("days")}
              >
                {viewTimestamp.format(dateFormat)}
              </th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          <tr>
            <td>
              <div className="rdtCounters">
                {allCounters.map(type => {
                  const val = getFormatted(type, viewTimestamp, timeFormat);
                  if (val) {
                    numCounters++;
                  }

                  return (
                    <TimePart
                      key={type}
                      showPrefix={numCounters > 1}
                      onUp={onStartClicking("add", type, props)}
                      onDown={onStartClicking("sub", type, props)}
                      value={val}
                    />
                  );
                })}
                <TimePart
                  onUp={toggleDayPart(viewTimestamp, setSelectedDate)}
                  onDown={toggleDayPart(viewTimestamp, setSelectedDate)}
                  value={getFormatted("daypart", viewTimestamp, timeFormat)}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TimeView;
