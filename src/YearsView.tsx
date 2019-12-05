import * as React from "react";
import cc from "classcat";

import dayjs, { Dayjs } from "dayjs";

import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(isLeapYear);

import { ViewMode } from "./.";

export interface YearsViewProps {
  viewDate: Dayjs;
  setViewDate: (newSelectedDate: Dayjs) => void;
  selectedDate: Dayjs | undefined;
  setSelectedDate: (newDate: Dayjs) => void;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate: (date: Dayjs) => boolean;
}

function YearsView(props: YearsViewProps) {
  const {
    viewDate = dayjs(),
    setViewDate,
    selectedDate,
    setSelectedDate,
    setViewMode,
    isValidDate
  } = props;

  const startYear = Math.floor(viewDate.get("year") / 10) * 10;

  return (
    <div className="rdtYears">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => {
                setViewDate(viewDate.add(-10, "year"));
              }}
            >
              <span>‹</span>
            </th>
            <th
              className="rdtSwitch"
              onClick={() => setViewMode("years")}
              colSpan={2}
            >
              {startYear}-{startYear + 9}
            </th>
            <th
              className="rdtNext"
              onClick={() => {
                setViewDate(viewDate.add(10, "year"));
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
            const rowStartYear = startYear - 1 + rowNum * 4;

            return (
              <tr key={rowStartYear}>
                {[0, 1, 2, 3].map(y => {
                  const year = y + rowStartYear;
                  const currentYear = viewDate.set("year", year);
                  const startOfYear = viewDate.startOf("year");

                  const daysInYear = Array.from(
                    { length: viewDate.isLeapYear() ? 366 : 365 },
                    (e, i) => startOfYear.add(i + 1, "day")
                  );

                  const isDisabled = daysInYear.every(
                    d => typeof isValidDate === "function" && !isValidDate(d)
                  );

                  return (
                    <td
                      key={year}
                      className={cc([
                        "rdtYear",
                        {
                          rdtDisabled: isDisabled,
                          rdtActive:
                            selectedDate &&
                            dayjs(selectedDate).get("year") === year
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(viewDate.set("year", year));
                        }
                      }}
                    >
                      {currentYear.format("YYYY")}
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

export default YearsView;
