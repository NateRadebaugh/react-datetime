import * as React from "react";
import cc from "classcat";

import dayjs, { Dayjs } from "dayjs";
import { ViewMode } from "./.";

export interface MonthsViewProps {
  viewDate: Dayjs;
  setViewDate: (newSelectedDate: Dayjs) => void;
  selectedDate: Dayjs | undefined;
  setSelectedDate: (newDate: Dayjs) => void;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate: (date: Dayjs) => boolean;
}

function MonthsView(props: MonthsViewProps) {
  const {
    viewDate = dayjs(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    setViewMode,
    isValidDate
  } = props;

  return (
    <div className="rdtMonths">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => {
                setViewDate(viewDate.add(-1, "year"));
              }}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={() => setViewMode("years")}
              colSpan={2}
            >
              {viewDate.format("YYYY")}
            </th>
            <th
              className="rdtNext"
              onClick={() => {
                setViewDate(viewDate.add(1, "year"));
              }}
            >
              <span>›</span>
            </th>
          </tr>
        </thead>
      </table>
      <table>
        <tbody>
          {[0, 1, 2].map(rowNum => {
            // Use 4 columns per row
            const rowStartMonth = rowNum * 4;

            return (
              <tr key={rowStartMonth}>
                {[0, 1, 2, 3].map(m => {
                  const month = m + rowStartMonth;
                  const currentMonth = viewDate.set("month", month);

                  const daysInMonths: Dayjs[] = Array.from(
                    { length: currentMonth.daysInMonth() },
                    (e, i) => currentMonth.set("date", i + 1)
                  );

                  const isDisabled = daysInMonths.every(
                    d => typeof isValidDate === "function" && !isValidDate(d)
                  );
                  const monthDate = dayjs().set("month", month);

                  return (
                    <td
                      key={month}
                      className={cc([
                        "rdtMonth",
                        {
                          rdtDisabled: isDisabled,
                          rdtActive:
                            selectedDate &&
                            dayjs(selectedDate).isSame(currentMonth, "month")
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(viewDate.set("month", month));
                        }
                      }}
                    >
                      {monthDate.format("MMM")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default MonthsView;
