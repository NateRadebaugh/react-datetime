import * as React from "react";
import cc from "classcat";

import TimeView, { TimeViewProps } from "./TimeView";
import DaysView, { DaysViewProps } from "./DaysView";
import MonthsView, { MonthsViewProps } from "./MonthsView";
import YearsView, { YearsViewProps } from "./YearsView";
import { ViewMode } from "./.";

interface CalendarContainerProps {
  viewMode: ViewMode | undefined;
  isStatic: boolean;
  id?: string;
  className?: string;
  style?: { [x: string]: any };
}

const CalendarContainer = React.forwardRef(function CalendarContainer(
  props: CalendarContainerProps &
    TimeViewProps &
    DaysViewProps &
    MonthsViewProps &
    YearsViewProps,
  ref: any
) {
  const { viewMode, isStatic, id, className, style, ...rest } = props;

  let el: JSX.Element | undefined;
  switch (viewMode) {
    case "time":
      el = <TimeView {...rest} />;
      break;

    case "months":
      el = <MonthsView {...rest} />;
      break;

    case "years":
      el = <YearsView {...rest} />;
      break;

    case "days":
      el = <DaysView {...rest} />;
      break;

    default:
      return null;
  }

  return (
    <div
      ref={ref}
      id={id}
      data-testid="picker-wrapper"
      className={cc(["rdtPicker", className, { rdtStatic: isStatic }])}
      style={style}
    >
      {el}
    </div>
  );
});

export default CalendarContainer;
