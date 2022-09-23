import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  FC,
} from "react";
import Popover from "@reach/popover";
import useOnClickOutside from "use-onclickoutside";

import format from "date-fns/format";
import rawParse from "date-fns/parse";
import isDate from "date-fns/isDate";
import toDate from "date-fns/toDate";
import isDateValid from "date-fns/isValid";
import startOfDay from "date-fns/startOfDay";

import CalendarContainer from "./CalendarContainer";
import { Locale } from "date-fns";

export const FORMATS = {
  MONTH: "LL",
  SHORT_MONTH_NAME: "LLL",
  FULL_MONTH_NAME: "LLLL",
  SHORT_DAY: "d",
  DAY: "dd",
  SHORT_DAY_OF_WEEK: "iiiiii",
  YEAR: "yyyy",
  MILITARY_HOUR: "H",
  HOUR: "h",
  SHORT_HOUR: "h",
  SHORT_MINUTE: "m",
  MINUTE: "mm",
  SHORT_SECOND: "s",
  SECOND: "ss",
  SHORT_MILLISECOND: "SSS",
  MILLISECOND: "SSS",
  AM_PM: "a",
  FULL_TIMESTAMP: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

function useDefaultStateWithOverride<Type>(defaultValue: Type) {
  const [override, setOverride] = useState<Type | undefined>(undefined);
  const value = override || defaultValue;

  // Clear the override if the default changes
  useEffect(() => {
    setOverride(undefined);
  }, [defaultValue]);

  return [value, setOverride] as const;
}

function useDefaultDateWithOverride(defaultValue: Date) {
  const [override, setOverride] = useState<Date | undefined>(undefined);
  const value = override || defaultValue;

  // Clear the override if the default changes
  const changeVal = defaultValue.getTime();
  useEffect(() => {
    setOverride(undefined);
  }, [changeVal]);

  return [value, setOverride] as const;
}

function parse(
  date: Date | string | number | undefined,
  fullFormat: string,
  formatOptions: FormatOptions
): Date | undefined {
  if (typeof date === "string") {
    const asDate = rawParse(date, fullFormat, new Date(), formatOptions);
    if (isDateValid(asDate)) {
      const formatted = format(asDate, fullFormat, formatOptions);
      if (date === formatted) {
        return asDate;
      }
    }
  } else if (date) {
    const asDate = toDate(date);
    if (isDateValid(asDate)) {
      return asDate;
    }
  }

  return undefined;
}

export interface FormatOptions {
  locale: Locale | undefined;
}

export interface TimeConstraint {
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
  days: ViewMode;
  months: ViewMode;
  years: ViewMode;
}

const nextViewModes: NextViewModes = {
  days: "days",
  months: "days",
  years: "months",
};

function getDefaultViewMode(
  dateFormat: string,
  timeFormat: string
): ViewMode | undefined {
  if (dateFormat) {
    if (dateFormat.match(/[d]/)) {
      return "days";
    } else if (dateFormat.indexOf("L") !== -1) {
      return "months";
    } else if (dateFormat.indexOf("y") !== -1) {
      return "years";
    }
  }

  if (timeFormat) {
    return "time";
  }

  return undefined;
}

function getDateTypeMode(
  rawDateTypeMode: DateTypeMode | undefined
): DateTypeMode {
  if (typeof rawDateTypeMode === "string") {
    const lowerRawDateTypeMode = rawDateTypeMode.toLowerCase();
    switch (lowerRawDateTypeMode) {
      case "utc-ms-timestamp":
      case "input-format":
        return lowerRawDateTypeMode;
    }
  }

  return "Date";
}

export type DateTypeMode = "utc-ms-timestamp" | "input-format" | "Date";

export interface Props
  extends Omit<
    React.HTMLProps<HTMLInputElement>,
    "onFocus" | "onBlur" | "onChange" | "value"
  > {
  isValidDate?: (date: Date) => boolean;

  dateTypeMode?: DateTypeMode;
  value?: string | number | Date;
  onChange?: (newValue: undefined | string | number | Date) => void;
  onFocus?: () => void;
  onBlur?: (newValue: undefined | string | number | Date) => void;

  dateFormat?: string | boolean;
  timeFormat?: string | boolean;

  locale?: Locale;

  shouldHideInput?: boolean;
  timeConstraints?: TimeConstraints;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
export const DateTime: FC<Props> = (props): JSX.Element => {
  const {
    isValidDate,
    dateTypeMode: rawDateTypeMode,
    value,
    onChange: rawOnChange,
    onBlur,
    onFocus,
    dateFormat: rawDateFormat = true,
    timeFormat: rawTimeFormat = true,
    locale,
    shouldHideInput = false,
    timeConstraints,
    ...rest
  } = props;

  const isDisabled = props.disabled || props.readOnly;

  //
  // Formats
  //
  const defaultDateFormat = `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`;
  const dateFormat =
    rawDateFormat === true
      ? defaultDateFormat
      : rawDateFormat === false
      ? ""
      : rawDateFormat;

  const defaultTimeFormat = `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`;
  const timeFormat =
    rawTimeFormat === true
      ? defaultTimeFormat
      : rawTimeFormat === false
      ? ""
      : rawTimeFormat;

  const fullFormat =
    dateFormat && timeFormat
      ? `${dateFormat} ${timeFormat}`
      : dateFormat || timeFormat || "";

  const formatOptions = useMemo<FormatOptions>(
    () => ({
      locale,
    }),
    [locale]
  );

  const valueAsDate = parse(value, fullFormat, formatOptions);
  const dateTypeMode = getDateTypeMode(rawDateTypeMode);

  const getChangedValue = useCallback(
    (newValue: undefined | string | Date) => {
      if (typeof newValue === "string") {
        return newValue;
      }

      if (!newValue) {
        return newValue;
      }

      switch (dateTypeMode) {
        case "utc-ms-timestamp":
          return newValue.getTime();

        case "input-format":
          return format(newValue, fullFormat, formatOptions);
      }

      return newValue;
    },
    [dateTypeMode, formatOptions, fullFormat]
  );

  //
  // On Change
  // string -> string
  // falsy -> raw onChange
  // Date -> if numeric, number (ms)
  // Date -> if not numeric, Date
  //
  const onChange = useCallback(
    (newValue: string | Date | undefined): void => {
      if (typeof rawOnChange !== "function") {
        return;
      }

      const changedValue = getChangedValue(newValue);

      //
      // Suppress change event when the value didn't change!
      //
      if (value && changedValue && isDate(value) && isDate(changedValue)) {
        const oldValStr = format(
          value as number | Date,
          fullFormat,
          formatOptions
        );
        const newValStr = format(
          changedValue as number | Date,
          fullFormat,
          formatOptions
        );
        if (oldValStr === newValStr) {
          return;
        }
      }

      rawOnChange(changedValue);
    },
    [formatOptions, fullFormat, getChangedValue, rawOnChange, value]
  );

  //
  // ViewDate
  //
  const [viewDate, setViewDate] = useDefaultDateWithOverride(
    valueAsDate || startOfDay(new Date())
  );

  //
  // ViewMode
  //
  const defaultViewMode = getDefaultViewMode(dateFormat, timeFormat);
  const [viewMode, setViewMode] = useDefaultStateWithOverride(defaultViewMode);

  //
  // ViewTimestamp
  //
  const [viewTimestamp, setViewTimestamp] = useDefaultDateWithOverride(
    valueAsDate || viewDate
  );

  //
  // IsOpen
  //
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    // Don't allow opening if disabled
    if (isDisabled) {
      return;
    }

    if (!isOpen && viewMode) {
      setIsOpen(true);

      if (typeof onFocus === "function") {
        onFocus();
      }
    }
  }

  function closeWith(newValue: undefined | string | Date) {
    if (isOpen) {
      setIsOpen(false);

      if (typeof onBlur === "function") {
        const changedValue = getChangedValue(newValue);
        onBlur(changedValue);
      }
    }
  }

  function close() {
    return closeWith(valueAsDate);
  }

  //
  // SetSelectedDate
  //
  function setSelectedDate(newDate: Date, tryClose = true) {
    const asDate = toDate(newDate);
    setViewDate(asDate);
    setViewTimestamp(asDate);

    // Time switches value but stays open
    if (viewMode === "time") {
      onChange(newDate);
    }
    // When view mode is the default, switch and try to close
    else if (viewMode === defaultViewMode) {
      onChange(newDate);

      if (tryClose) {
        closeWith(newDate);
      }
    }
    // When view mode is not the default, switch to the next view mode
    else {
      const newViewMode: ViewMode | undefined = viewMode
        ? nextViewModes[viewMode]
        : undefined;
      setViewMode(newViewMode);
    }
  }

  //
  // Trigger change when important props change
  //
  useEffect(() => {
    if (valueAsDate) {
      setSelectedDate(valueAsDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateTypeMode, fullFormat]);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value: newValue } = e.target;

    const newValueAsDate = parse(newValue, fullFormat, formatOptions);
    if (newValueAsDate) {
      setSelectedDate(newValueAsDate, false);
    } else {
      onChange(newValue);
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isOpen) {
      switch (e.code) {
        // Enter key
        case "Enter":
          // Eat enter key
          e.preventDefault();

        // Escape key
        case "Escape":
        // Tab key
        case "Tab":
          close();

          break;
      }
    } else {
      switch (e.code) {
        // Down arrow
        case "ArrowDown":
          open();
          break;
      }
    }
  }

  const inputRef = useRef(null);
  const contentRef = useRef(null);

  useOnClickOutside(contentRef, close);

  const valueStr: string =
    valueAsDate && fullFormat
      ? format(valueAsDate, fullFormat, formatOptions)
      : typeof value === "string"
      ? value
      : "";

  //
  // Input Props
  //
  const finalInputProps = {
    ...rest,
    ref: inputRef,
    type: "text",
    onClick: open,
    onFocus: open,
    onChange: onInputChange,
    onKeyDown: onInputKeyDown,
    value: valueStr,
  };

  //
  // Calendar props
  //
  const calendarProps = {
    ref: contentRef,
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
    isValidDate,
    isStatic: shouldHideInput,
    timeConstraints,
  };

  return !shouldHideInput ? (
    <>
      <input {...finalInputProps} />
      {isOpen && (
        <Popover targetRef={inputRef}>
          <CalendarContainer {...calendarProps} />
        </Popover>
      )}
    </>
  ) : (
    <CalendarContainer {...finalInputProps} {...calendarProps} />
  );
};

export default DateTime;
