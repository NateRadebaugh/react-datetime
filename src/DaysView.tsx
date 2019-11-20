import * as React from "react";
import cc from "classcat";
import dayjs from "dayjs";

import { ViewMode } from "./.";

export interface DaysViewProps {
  timeFormat: string | false;
  viewDate: Date;
  setViewDate: (newSelectedDate: Date) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (newDate: Date) => void;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate?: (date: Date) => boolean;
}

function DaysView(props: DaysViewProps) {
  const {
    timeFormat = false,
    viewDate = new Date(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    setViewMode,
    isValidDate
  } = props;

  const viewDayJs = dayjs(viewDate);
  const selectedDayJs = dayjs(selectedDate);

  const sunday = viewDayJs.startOf("week");

  const prevMonth = viewDayJs.add(-1, "month");
  const endOfPrevMonth = prevMonth.endOf("month");
  const startOfLastWeekOfPrevMonth = endOfPrevMonth.startOf("week");
  const daysSinceStartOfLastWeekOfPrevMonth = startOfLastWeekOfPrevMonth.diff(
    viewDayJs,
    "day"
  );
  const prevMonthLastWeekStart = viewDayJs.add(
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
              onClick={() => setViewDate(viewDayJs.add(-1, "month").toDate())}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={() => setViewMode("months")}
              colSpan={5}
            >
              {viewDayJs.format("MMMM YYYY")}
            </th>
            <th
              className="rdtNext"
              onClick={() => setViewDate(viewDayJs.add(1, "month").toDate())}
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
                    !isValidDate(workingDate.toDate());

                  return (
                    <td
                      key={workingDate.format()}
                      className={cc([
                        "rdtDay",
                        {
                          rdtOld: workingDate.isBefore(
                            viewDayJs.startOf("month")
                          ),
                          rdtNew: viewDayJs
                            .endOf("month")
                            .isBefore(workingDate),
                          rdtActive:
                            selectedDate &&
                            workingDate.isSame(selectedDayJs, "day"),
                          rdtToday: workingDate.isSame(new Date(), "day"),
                          rdtDisabled: isDisabled
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(workingDate.toDate());
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
                {viewDayJs.format(timeFormat)}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default DaysView;
