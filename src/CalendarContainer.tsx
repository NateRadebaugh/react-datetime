import * as React from "react";
import useOnClickOutside from "use-onclickoutside";
import Days from "./DaysView";
import Months from "./MonthsView";
import Years from "./YearsView";
import Time from "./TimeView";
import noop from "./noop";

const { useRef } = React;

const views = {
  days: Days,
  months: Months,
  years: Years,
  time: Time
};

interface CalendarContainerProps {
  view?: "years" | "months" | "days" | "time";
  viewProps?: any;
  onClickOutside?: any;
}

function CalendarContainer(props: CalendarContainerProps) {
  const { view = "days", onClickOutside = noop, viewProps = {} } = props;

  const ref = useRef(null);
  useOnClickOutside(ref, onClickOutside);

  const Component = views[view];
  return (
    <Component forwardRef={ref} {...viewProps} readonly={!!viewProps.value} />
  );
}

export default CalendarContainer;
