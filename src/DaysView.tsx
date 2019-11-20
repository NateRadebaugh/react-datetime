import * as React from "react";
import cc from "classcat";
import dayjs, { Dayjs } from "dayjs";

import { ViewMode } from "./.";

export interface DaysViewProps {
  timeFormat: string | false;
  viewDate: Dayjs;
  setViewDate: (newSelectedDate: Dayjs) => void;
  selectedDate: Dayjs | undefined;
  setSelectedDate: (newDate: Dayjs) => void;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate: (date: Dayjs) => boolean;
}

function DaysView(props: DaysViewProps) {
  const {
    timeFormat = false,
    viewDate = dayjs(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    setViewMode,
    isValidDate
  } = props;

  const sunday = viewDate.startOf("week");

  const prevMonth = viewDate.add(-1, "month");
  const endOfPrevMonth = prevMonth.endOf("month");
  const startOfLastWeekOfPrevMonth = endOfPrevMonth.startOf("week");
  const daysSinceStartOfLastWeekOfPrevMonth = startOfLastWeekOfPrevMonth.diff(
    viewDate,
    "day"
  );
  const prevMonthLastWeekStart = viewDate.add(
    daysSinceStartOfLastWeekOfPrevMonth,
    "day"
  );

  return (
    <div className="rdtDays">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => setViewDate(viewDate.add(-1, "month"))}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={() => setViewMode("months")}
              colSpan={5}
            >
              {viewDate.format("MMMM YYYY")}
            </th>
            <th
              className="rdtNext"
              onClick={() => setViewDate(viewDate.add(1, "month"))}
            >
              <span>›</span>
            </th>
          </tr>
          <tr>
            {[0, 1, 2, 3, 4, 5, 6].map(colNum => (
              <th key={colNum} className="dow">
                {sunday.add(colNum, "day").format("dd")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4, 5].map(rowNum => {
            // Use 7 columns per row
            const rowStartDay = rowNum * 7;

            return (
              <tr key={prevMonthLastWeekStart.add(rowStartDay, "day").format()}>
                {[0, 1, 2, 3, 4, 5, 6].map(d => {
                  const i = d + rowStartDay;
                  const workingDate = prevMonthLastWeekStart.add(i, "day");
                  const isDisabled =
                    typeof isValidDate === "function" &&
                    !isValidDate(workingDate);

                  return (
                    <td
                      key={workingDate.format()}
                      className={cc([
                        "rdtDay",
                        {
                          rdtOld: workingDate.isBefore(
                            viewDate.startOf("month")
                          ),
                          rdtNew: viewDate.endOf("month").isBefore(workingDate),
                          rdtActive:
                            selectedDate &&
                            workingDate.isSame(selectedDate, "day"),
                          rdtToday: workingDate.isSame(new Date(), "day"),
                          rdtDisabled: isDisabled
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(workingDate);
                        }
                      }}
                    >
                      {workingDate.format("D")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {typeof timeFormat === "string" && timeFormat.trim() && (
          <tfoot>
            <tr>
              <td
                onClick={() => setViewMode("time")}
                colSpan={7}
                className="rdtTimeToggle"
              >
                {viewDate.format(timeFormat)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default DaysView;
