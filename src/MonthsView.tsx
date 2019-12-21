import * as React from "react";
import cc from "classcat";
import dayjs, { Dayjs } from "dayjs";
import { ViewMode } from "./index";

export interface MonthsViewProps {
  viewDate: Dayjs;
  setViewDate: (newViewDate: Dayjs | undefined) => void;
  selectedDate: Dayjs | undefined;
  setSelectedDate: (newDate: Dayjs, tryClose?: boolean) => void;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate?: (date: Dayjs) => boolean;
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
    <div className="rdtMonths" data-testid="month-picker">
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
              data-testid="month-mode-switcher"
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

                  const isActive =
                    selectedDate &&
                    dayjs(selectedDate).isSame(currentMonth, "month");

                  return (
                    <td
                      key={month}
                      className={cc([
                        "rdtMonth",
                        {
                          rdtDisabled: isDisabled,
                          rdtActive: isActive
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
