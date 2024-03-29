import * as React from "react";
import clsx from "clsx";

import addDays from "date-fns/addDays";
import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";
import startOfWeek from "date-fns/startOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import isSameDay from "date-fns/isSameDay";
import isBefore from "date-fns/isBefore";
import addMonths from "date-fns/addMonths";
import getDate from "date-fns/getDate";
import { FormatOptions, ViewMode, FORMATS } from "./index";

export interface DaysViewProps {
  timeFormat: string;
  viewDate: Date;
  setViewDate: (newViewDate: Date | undefined) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (newDate: Date, tryClose?: boolean) => void;
  formatOptions: FormatOptions;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate?: (date: Date) => boolean;
}

function DaysView(props: DaysViewProps): JSX.Element {
  const {
    timeFormat,
    viewDate,
    setViewDate,
    selectedDate,
    setSelectedDate,
    formatOptions,
    setViewMode,
    isValidDate,
  } = props;

  const weekStart = startOfWeek(viewDate, formatOptions);

  const prevMonth = addMonths(viewDate, -1);
  const daysSincePrevMonthLastWeekStart = differenceInDays(
    startOfWeek(endOfMonth(prevMonth), formatOptions),
    viewDate
  );
  const prevMonthLastWeekStart = addDays(
    viewDate,
    daysSincePrevMonthLastWeekStart
  );

  return (
    <div className="rdtDays" data-testid="day-picker">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => setViewDate(addMonths(viewDate, -1))}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              data-testid="day-mode-switcher"
              onClick={() => setViewMode("months")}
              colSpan={5}
            >
              {format(
                viewDate,
                `${FORMATS.FULL_MONTH_NAME} ${FORMATS.YEAR}`,
                formatOptions
              )}
            </th>
            <th
              className="rdtNext"
              onClick={() => setViewDate(addMonths(viewDate, 1))}
            >
              <span>›</span>
            </th>
          </tr>
          <tr>
            {[0, 1, 2, 3, 4, 5, 6].map((colNum) => (
              <th key={colNum} className="dow">
                {format(
                  addDays(weekStart, colNum),
                  FORMATS.SHORT_DAY_OF_WEEK,
                  formatOptions
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4, 5].map((rowNum) => {
            // Use 7 columns per row
            const rowStartDay = rowNum * 7;

            return (
              <tr
                key={format(
                  addDays(prevMonthLastWeekStart, rowStartDay),
                  FORMATS.FULL_TIMESTAMP
                )}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((d) => {
                  const i = d + rowStartDay;
                  const workingDate = addDays(prevMonthLastWeekStart, i);
                  const isDisabled =
                    typeof isValidDate === "function" &&
                    !isValidDate(workingDate);

                  const isActive =
                    selectedDate && isSameDay(workingDate, selectedDate);

                  return (
                    <td
                      key={getDate(workingDate)}
                      className={clsx([
                        "rdtDay",
                        {
                          rdtOld: isBefore(workingDate, startOfMonth(viewDate)),
                          rdtNew: isBefore(endOfMonth(viewDate), workingDate),
                          rdtActive: isActive,
                          rdtToday: isSameDay(workingDate, new Date()),
                          rdtDisabled: isDisabled,
                        },
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(workingDate);
                        }
                      }}
                    >
                      {format(workingDate, FORMATS.SHORT_DAY, formatOptions)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {timeFormat ? (
          <tfoot>
            <tr>
              <td
                onClick={() => setViewMode("time")}
                colSpan={7}
                className="rdtTimeToggle"
                data-testid="day-to-time-mode-switcher"
              >
                {format(viewDate, timeFormat, formatOptions)}
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

export default DaysView;
