import * as React from "react";
import cc from "classcat";

import dayjs from "dayjs";

import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(isLeapYear);

import { ViewMode } from "./.";

export interface YearsViewProps {
  viewDate: Date;
  setViewDate: (newSelectedDate: Date) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (newDate: Date) => void;
  setViewMode: (newViewMode: ViewMode) => void;
  isValidDate?: (date: Date) => boolean;
}

function YearsView(props: YearsViewProps) {
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

  const startYear = Math.floor(viewDayJs.get("year") / 10) * 10;

  return (
    <div className="rdtYears">
      <table>
        <thead>
          <tr>
            <th
              className="rdtPrev"
              onClick={() => {
                setViewDate(viewDayJs.add(-10, "year").toDate());
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
                setViewDate(viewDayJs.add(10, "year").toDate());
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
                  const currentYear = viewDayJs.set("year", year);
                  const startOfYear = viewDayJs.startOf("year");

                  const daysInYear = Array.from(
                    { length: viewDayJs.isLeapYear() ? 366 : 365 },
                    (e, i) => startOfYear.add(i + 1, "day")
                  );

                  const isDisabled = daysInYear.every(
                    d =>
                      typeof isValidDate === "function" &&
                      !isValidDate(d.toDate())
                  );

                  return (
                    <td
                      key={year}
                      className={cc([
                        "rdtYear",
                        {
                          rdtDisabled: isDisabled,
                          rdtActive:
                            selectedDate && selectedDayJs.get("year") === year
                        }
                      ])}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedDate(viewDayJs.set("year", year).toDate());
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
