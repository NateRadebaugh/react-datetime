import * as React from "react";
import cc from "classcat";
import Popover from "@reach/popover";
import useOnClickOutside from "use-onclickoutside";

import format from "date-fns/format";
import rawParse from "date-fns/parse";
import isDateValid from "date-fns/isValid";
import startOfDay from "date-fns/startOfDay";

import CalendarContainer from "./CalendarContainer";
import returnTrue from "./returnTrue";

const { useRef, useState, useEffect } = React;

function parse(
  date: Date | string | undefined,
  fullFormat: string,
  formatOptions: any
): Date | undefined {
  if (date instanceof Date && isDateValid(date)) {
    return date;
  }

  if (typeof date === "string") {
    const asDate = rawParse(date, fullFormat, undefined as any, formatOptions);
    if (isDateValid(asDate)) {
      return asDate;
    }
  }

  return undefined;
}

export interface TimeConstraint {
  min: number;
  max: number;
  step: number;
}

export interface TimeConstraints {
  hours?: TimeConstraint;
  minutes?: TimeConstraint;
  seconds?: TimeConstraint;
  milliseconds?: TimeConstraint;
}

export type ViewMode = "days" | "months" | "years" | "time";

interface NextViewModes {
  days: "days";
  months: "days";
  years: "months";
}

const nextViewModes: NextViewModes = {
  days: "days",
  months: "days",
  years: "months"
};

function getInitialViewMode(
  dateFormat: string | false,
  timeFormat: string | false
): ViewMode | undefined {
  if (typeof dateFormat === "string") {
    if (dateFormat.match(/[lLD]/)) {
      return "days";
    } else if (dateFormat.indexOf("M") !== -1) {
      return "months";
    } else if (dateFormat.indexOf("Y") !== -1) {
      return "years";
    }
  }

  if (typeof timeFormat === "string") {
    return "time";
  }

  return undefined;
}

interface DateTimeProps {
  className?: string;
  style?: any;
  placeholder?: string;
  isValidDate?: any;

  defaultValue?: string | Date;
  value?: string | Date;

  viewDate?: Date;
  dateFormat?: string | boolean;
  timeFormat?: string | boolean;

  input?: boolean;

  open?: boolean;
  defaultOpen?: boolean;
  disableOnClickOutside?: boolean;

  locale?: any;

  onChange?: any;
  viewMode?: ViewMode;
}

function DateTime(props: DateTimeProps) {
  const {
    className,
    style,
    placeholder,
    isValidDate = returnTrue,
    defaultValue: uncontrolledDefaultValue,
    value: controlledValue,
    onChange: setControlledValue,
    viewDate: propViewDate,
    dateFormat: rawDateFormat = true,
    timeFormat: rawTimeFormat = true,
    input: isInput = true,
    open: controlledIsOpen,
    locale,
    viewMode: propViewMode,
    defaultOpen,
    disableOnClickOutside,
    ...rest
  } = props;

  //
  // Controlled/uncontrolled value
  //
  const [uncontrolledValue, setUncontrolledValue] = useState(
    uncontrolledDefaultValue
  );
  const isControlled = typeof setControlledValue === "function";
  const value = isControlled ? controlledValue : uncontrolledValue;
  const onChange = isControlled ? setControlledValue : setUncontrolledValue;

  //
  // Formats
  //
  const dateFormat = rawDateFormat === true ? "LL/dd/yyyy" : rawDateFormat;
  const timeFormat = rawTimeFormat === true ? "h:mm a" : rawTimeFormat;
  const fullFormat =
    dateFormat && timeFormat
      ? `${dateFormat} ${timeFormat}`
      : dateFormat || timeFormat || "";

  const formatOptions = {
    locale
  };

  const valueAsDate = parse(value, fullFormat, formatOptions);

  //
  // ViewDate
  //
  const [viewDate, setViewDate] = useState();
  useEffect(() => {
    setViewDate(propViewDate || valueAsDate || startOfDay(new Date()));
  }, [propViewDate, valueAsDate]);

  //
  // ViewMode
  //
  const defaultViewMode = getInitialViewMode(dateFormat, timeFormat);
  const [viewMode, setViewMode] = useState();
  useEffect(() => {
    setViewMode(propViewMode || defaultViewMode);
  }, [propViewMode, defaultViewMode]);

  //
  // ViewTimestamp
  //
  const [viewTimestamp, setViewTimestamp] = useState();
  useEffect(() => {
    setViewTimestamp(valueAsDate || viewDate);
  }, [valueAsDate, viewDate]);

  //
  // IsOpen
  //
  const [internalIsOpen, setIsOpen] = useState(defaultOpen);
  const isOpen =
    typeof controlledIsOpen === "boolean" ? controlledIsOpen : internalIsOpen;

  //
  // SetSelectedDate
  //
  function setSelectedDate(newDate: Date, tryClose = true) {
    setViewDate(newDate);
    setViewTimestamp(newDate);

    // Time switches value but stays open
    if (viewMode === "time") {
      onChange(newDate);
    }
    // When view mode is the default, switch and try to close
    else if (viewMode === defaultViewMode) {
      onChange(newDate);

      if (tryClose) {
        setIsOpen(false);
      }
    }
    // When view mode is not the default, switch to the next view mode
    else {
      const newViewMode = viewMode ? nextViewModes[viewMode] : undefined;
      setViewMode(newViewMode);
    }
  }

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function onInputChange(e: React.FormEvent<HTMLInputElement>) {
    const { value: newValue } = e.target as HTMLInputElement;

    const newValueAsDate = parse(newValue, fullFormat, formatOptions);
    if (newValueAsDate) {
      setSelectedDate(newValueAsDate, false);
    } else {
      onChange(newValue);
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Enter key
    if (isOpen && e.which === 13) {
      close();
    }

    // Escape key
    if (isOpen && e.which === 27) {
      close();
    }

    // Tab key
    if (isOpen && e.which === 9) {
      close();
    }

    // Down arrow
    if (!isOpen && e.which === 40) {
      open();
    }
  }

  const inputRef = useRef(null);
  const contentRef = useRef(null);

  useOnClickOutside(contentRef, () => {
    if (!disableOnClickOutside) {
      close();
    }
  });

  const valueStr: string = valueAsDate
    ? format(valueAsDate, fullFormat, formatOptions)
    : typeof value === "string"
    ? value
    : "";

  //
  // Input Props
  //
  const finalInputProps = {
    type: "text",
    className,
    style,
    onClick: open,
    onFocus: open,
    onChange: onInputChange,
    onKeyDown: onInputKeyDown,
    placeholder,
    value: valueStr,
    ...rest
  };

  //
  // Calendar props
  //
  const calendarProps = {
    dateFormat,
    timeFormat,
    viewDate,
    setViewDate,
    selectedDate: valueAsDate,
    setSelectedDate,
    viewTimestamp,
    setViewTimestamp,
    formatOptions,
    viewMode,
    setViewMode,
    isValidDate
  };

  return (
    <>
      {isInput ? (
        <div className={cc(["rdt", { rdtOpen: isOpen }])}>
          <input ref={inputRef} key="i" {...finalInputProps} />
          {isOpen && viewMode && (
            <Popover targetRef={inputRef}>
              <div ref={contentRef} className="rdtPicker">
                <CalendarContainer {...calendarProps} />
              </div>
            </Popover>
          )}
        </div>
      ) : (
        viewMode && (
          <div className="rdt rdtStatic rdtOpen">
            <div className="rdtPicker">
              <CalendarContainer {...calendarProps} />
            </div>
          </div>
        )
      )}
    </>
  );
}

export default DateTime;
