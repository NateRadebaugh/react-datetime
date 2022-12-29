import { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DateTime, DateTimeProps, FORMATS } from ".";
import "../scss/styles.scss";

import isBefore from "date-fns/isBefore";
import startOfDay from "date-fns/startOfDay";
import isMonday from "date-fns/isMonday";
import isWeekend from "date-fns/isWeekend";
import isSameMonth from "date-fns/isSameMonth";
import isSameYear from "date-fns/isSameYear";

import nl from "date-fns/locale/nl";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";

const { useState } = React;

const meta = {
  component: DateTime,
  //tags: ["autodocs"],
} satisfies Meta<typeof DateTime>;

export default meta;

export const SimpleExamples: () => JSX.Element = () => {
  function UncontrolledDateTime(props: {
    value?: string | number | Date | undefined;
    dateFormat?: string | boolean;
    timeFormat?: string | boolean;
  }) {
    const [value, setValue] = useState<string | number | Date | undefined>(
      props.value
    );

    return (
      <div>
        <strong>Props:</strong> {JSON.stringify(props)}
        <div>
          <React.StrictMode>
            <DateTime
              {...props}
              value={value}
              onChange={(newVal) => {
                setValue(newVal);
              }}
              onBlur={(newVal) => {
                alert(newVal);
              }}
            />
          </React.StrictMode>
        </div>
        <br />
      </div>
    );
  }

  return (
    <div>
      <h2>Simple Scenarios</h2>

      <UncontrolledDateTime />

      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
      />
      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
        timeFormat={false}
      />
      <UncontrolledDateTime dateFormat={false} />

      <UncontrolledDateTime
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
      <UncontrolledDateTime
        dateFormat={false}
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
      <UncontrolledDateTime timeFormat={false} />

      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SimpleExamples as any).parameters = {
  controls: { hideNoControlsWarning: true },
};

export function InlineExamples(): JSX.Element {
  function UncontrolledDateTime({
    label,
    ...props
  }: {
    label: string;
    value: string | number | Date | undefined;
    dateFormat?: string | boolean;
    timeFormat?: string | boolean;
    shouldHideInput?: boolean;
  }) {
    const [value, setValue] = useState<string | number | Date | undefined>(
      props.value
    );

    return (
      <div className="col-sm-auto mb-3">
        <div>
          <strong>{label}</strong> - {props.dateFormat} {props.timeFormat}
        </div>
        <React.StrictMode>
          <DateTime
            {...props}
            value={value}
            onChange={(newVal) => {
              setValue(newVal);
            }}
          />
        </React.StrictMode>
      </div>
    );
  }

  return (
    <div>
      <div className="container-fluid">
        <h2>Inline Examples</h2>

        <div className="row">
          <UncontrolledDateTime
            label="Date/Time"
            shouldHideInput
            dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
            timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Date"
            shouldHideInput
            dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
            timeFormat={false}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Month"
            shouldHideInput
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
            timeFormat={false}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Year"
            shouldHideInput
            dateFormat={`${FORMATS.YEAR}`}
            timeFormat={false}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Time"
            shouldHideInput
            dateFormat={false}
            timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />
        </div>
      </div>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(InlineExamples as any).parameters = {
  controls: { hideNoControlsWarning: true },
};

type CustomizableExampleComponentProps = Pick<
  DateTimeProps,
  | "shouldHideInput"
  | "dateFormat"
  | "timeFormat"
  | "locale"
  | "weekStartsOn"
  | "dateTypeMode"
  | "isValidDate"
  | "timeConstraints"
>;
function CustomizableExampleComponent(
  props: CustomizableExampleComponentProps
): JSX.Element {
  const [value, setValue] = useState<string | number | Date | undefined>(
    new Date(2022, 11, 29, 11, 25)
  );

  return (
    <div className="form-horizontal">
      <h2>Customization props</h2>
      <p>
        Try out various configuration options (via <strong>controls</strong>)
        and see how they affect the component.
      </p>

      <div>
        <strong>Value:</strong> {JSON.stringify(value)}
      </div>

      <form
        onSubmit={(e) => {
          alert("submitted");
          e.preventDefault();
        }}
      >
        <React.StrictMode>
          <DateTime
            {...props}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
          />
        </React.StrictMode>
      </form>
    </div>
  );
}

const localeOptions = {
  "EN - undefined": undefined,
  "NL - nl": nl,
  "ES - es": es,
  "FR - fr": fr,
};

const dateFormatOptions = [
  undefined,
  false,
  `${FORMATS.YEAR}-${FORMATS.MONTH}-${FORMATS.DAY}`,
  `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
  `${FORMATS.DAY}.${FORMATS.MONTH}.${FORMATS.YEAR}`,
  `${FORMATS.MONTH}-${FORMATS.DAY}`,
  `${FORMATS.FULL_MONTH_NAME}`,
  `${FORMATS.YEAR}/${FORMATS.MONTH}`,
  `${FORMATS.YEAR}`,
].reduce((prev, curr) => {
  return { ...prev, [`${curr}`]: curr };
}, {});

const timeFormatOptions = [
  undefined,
  false,
  `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
  `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}`,
  `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND}`,
  `${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`,
  `${FORMATS.HOUR}${FORMATS.MINUTE}`,
  `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}xxx`,
].reduce((prev, curr) => {
  return { ...prev, [`${curr}`]: curr };
}, {});

const isValidDateOptions = {
  "default - undefined": undefined,
  "All Valid": () => true,
  "All Invalid": () => false,
  "Only Mondays": (date: Date) => isMonday(date),
  "Only Weekdays": (date: Date) => !isWeekend(date),
  "Only Weekends": (date: Date) => isWeekend(date),
  "Days Before The 18th": (date: Date) =>
    isBefore(date, startOfDay(new Date(2019, 7, 18, 11, 25))),
  "Just March": (date: Date) => isSameMonth(date, new Date(2019, 2, 16)),
  "Just 2012": (date: Date) => isSameYear(date, new Date(2012, 2, 16)),
};

const weekStartsOnOptions = {
  "default - undefined": undefined,
  "0 - Sunday": 0,
  "1 - Monday": 1,
  "2 - Tuesday": 2,
  "3 - Wednesday": 3,
  "4 - Thursday": 4,
};

const timeConstraintsOptions = {
  "default - undefined": undefined,
  "Step 1": {
    hours: {
      step: 1,
    },
    minutes: {
      step: 1,
    },
    seconds: {
      step: 1,
    },
    milliseconds: {
      step: 1,
    },
  },
  "15 Minutes": {
    minutes: {
      step: 15,
    },
  },
};

export const CustomizableExample = {
  render: (args) => <CustomizableExampleComponent {...args} />,

  args: {
    shouldHideInput: true,
    locale: undefined,
    weekStartsOn: 1,
    dateFormat: `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
    timeFormat: `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
    isValidDate: undefined,
    timeConstraints: undefined,
  },
  argTypes: {
    shouldHideInput: {
      control: "boolean",
    },
    locale: {
      control: "inline-radio",
      options: Object.keys(localeOptions),
      mapping: localeOptions,
    },
    dateFormat: {
      control: "inline-radio",
      options: Object.keys(dateFormatOptions),
      mapping: dateFormatOptions,
    },
    timeFormat: {
      control: "inline-radio",
      options: Object.keys(timeFormatOptions),
      mapping: timeFormatOptions,
    },
    dateTypeMode: {
      control: "inline-radio",
      options: ["utc-ms-timestamp", "input-format", "Date"],
    },
    isValidDate: {
      control: "inline-radio",
      options: Object.keys(isValidDateOptions),
      mapping: isValidDateOptions,
    },
    weekStartsOn: {
      control: "inline-radio",
      options: Object.keys(weekStartsOnOptions),
      mapping: weekStartsOnOptions,
    },
    timeConstraints: {
      control: "inline-radio",
      options: Object.keys(timeConstraintsOptions),
      mapping: timeConstraintsOptions,
    },
  },
  parameters: {
    controls: {
      exclude: ["value", "onChange", "onFocus", "onBlur"],
    },
  },
} satisfies StoryObj<typeof meta>;
