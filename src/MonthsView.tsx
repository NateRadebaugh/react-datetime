import * as React from "react";
import cc from "classcat";

import dayjs from "dayjs";
import { ViewMode } from "./.";

export interface MonthsViewProps {
  viewDate: Date;
  setViewDate: (newSelectedDate: Date) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (newDate: Date) => void;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate?: (date: Date) => boolean;
}

function MonthsView(props: MonthsViewProps) {
  const {
    viewDate = new Date(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    setViewMode,
    isValidDate
  } = props;

  const viewDayJs = dayjs(viewDate);
  const selectedDayJs = dayjs(selectedDate);

  return (
    <div className="rdtMonths">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => {
                setViewDate(viewDayJs.add(-1, "year").toDate());
              }}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={() => setViewMode("years")}
              colSpan={2}
            >
              {viewDayJs.format("YYYY")}
            </th>
            <th
              className="rdtNext"
              onClick={() => {
                setViewDate(viewDayJs.add(1, "year").toDate());
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
                  const currentMonth = viewDayJs.set("month", month);

                  const daysInMonths: Date[] = Array.from(
                    { length: currentMonth.daysInMonth() },
                    (e, i) => currentMonth.set("date", i + 1).toDate()
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
                            selectedDayJs.isSame(currentMonth, "month")
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(
                            viewDayJs.set("month", month).toDate()
                          );
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
