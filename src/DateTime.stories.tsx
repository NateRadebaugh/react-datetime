import * as React from "react";
import DateTime from ".";
import "../scss/styles.scss";

import isBefore from "date-fns/isBefore";
import startOfDay from "date-fns/startOfDay";

const { useState } = React;

export default {
  title: "DateTime"
};

export function SimpleExample() {
  function UncontrolledDateTime(props) {
    const [value, setValue] = useState<any>("");

    return (
      <div>
        <strong>Props:</strong> {JSON.stringify(props)}
        <div>
          <DateTime
            value={value}
            onChange={newVal => {
              console.log({ newVal });
              setValue(newVal);
            }}
            {...props}
          />
        </div>
        <br />
      </div>
    );
  }

  return (
    <div>
      <h2>Simple Scenarios</h2>

      <UncontrolledDateTime />

      <UncontrolledDateTime dateFormat="MM/DD/YYYY" />
      <UncontrolledDateTime dateFormat="MM/DD/YYYY" timeFormat={false} />
      <UncontrolledDateTime dateFormat={false} />

      <UncontrolledDateTime timeFormat="HH:mm" />
      <UncontrolledDateTime dateFormat={false} timeFormat="HH:mm" />
      <UncontrolledDateTime timeFormat={false} />

      <UncontrolledDateTime dateFormat="MM/DD/YYYY" timeFormat="HH:mm" />
    </div>
  );
}

export function CustomizableExample() {
  const [state, setState] = useState<any>({
    value: new Date(2019, 7, 2, 11, 25),
    dateFormat: "MM/DD/YYYY",
    timeFormat: "hh:mm a",
    dateTypeMode: undefined
  });

  function Select({ name, children }) {
    return (
      <div className="form-group">
        <label className="control-label col-xs-6">{name}</label>

        <div className="col-xs-6">
          <select
            className="form-control"
            value={state[name]}
            onChange={e => {
              let newValue: any = e.target.value;
              if (newValue === "true") {
                newValue = true;
              } else if (newValue === "false") {
                newValue = false;
              }

              setState({ ...state, [name]: newValue });
            }}
          >
            {children}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="form-horizontal">
      <h2>Customization props</h2>
      <p>
        Try out various configuration options and see how they affect the
        component.
      </p>

      <div>
        <strong>Value:</strong> {JSON.stringify(state.value)}
      </div>

      <DateTime
        value={state.value}
        onChange={newValue => {
          console.log(newValue);
          setState({ ...state, value: newValue });
        }}
        {...state}
      />

      <hr />

      <Select name="dateFormat">
        <option value="">false</option>
        <option>yyyy-LL-dd</option>
        <option>MM/DD/YYYY</option>
        <option>dd.LL.yyyy</option>
        <option>LL-dd</option>
        <option>LLLL</option>
        <option>yyyy/LL</option>
        <option>yyyy</option>
      </Select>

      <Select name="timeFormat">
        <option value="">false</option>
        <option>hh:mm a</option>
        <option>HH:mm:ss</option>
        <option>HH:mm:SSS</option>
        <option>hh:mm:SSS a</option>
        <option>hmm</option>
        <option>HH:mm xxx</option>
      </Select>

      <Select name="dateTypeMode">
        <option value="">default (Date)</option>
        <option>utc-ms-timestamp</option>
        <option>input-format</option>
        <option>Date</option>
      </Select>
    </div>
  );
}

export function ViewModeExample() {
  const [value, setValue] = useState(undefined);
  const [dateFormat, setDateFormat] = useState<string | boolean | undefined>(
    undefined
  );
  const [timeFormat, setTimeFormat] = useState<string | boolean | undefined>(
    undefined
  );

  function renderButton(
    text: string,
    newDateFormat: string | boolean | undefined,
    newTimeFormat: string | boolean | undefined
  ) {
    return (
      <button
        type="button"
        onClick={() => {
          setDateFormat(newDateFormat);
          setTimeFormat(newTimeFormat);
        }}
        disabled={dateFormat === newDateFormat && timeFormat === newTimeFormat}
      >
        {text}
      </button>
    );
  }

  return (
    <div>
      <h2>View Modes</h2>
      <p>Try out various formats and see how they affect the component.</p>
      <p>
        {renderButton("Default - undefined", undefined, undefined)}
        {renderButton("Years - yyyy", "yyyy", undefined)}
        {renderButton("Months - LL/yyyy", "LL/yyyy", undefined)}
        {renderButton("Days - MM/DD/YYYY", "MM/DD/YYYY", undefined)}
        {renderButton("Time - h:mm a", false, "h:mm a")}
      </p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
      />
    </div>
  );
}

export function ValidatedExample() {
  const [value, setValue] = useState(undefined);

  return (
    <div>
      <h2>isValidDate</h2>
      <p>You can use "isValidDate" to enable all dates before now.</p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        timeFormat={false}
        isValidDate={current => isBefore(current, startOfDay(new Date()))}
      />
    </div>
  );
}
