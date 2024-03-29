# react-datetime

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![npm version](https://badge.fury.io/js/%40nateradebaugh%2Freact-datetime.svg)](https://badge.fury.io/js/%40nateradebaugh%2Freact-datetime)

![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@nateradebaugh/react-datetime.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/NateRadebaugh/react-datetime/badge.svg)](https://snyk.io/test/github/NateRadebaugh/react-datetime)

A date and time picker in the same React component. It can be used as a datepicker, timepicker or both at the same time.

This project started as a fork of https://github.com/YouCanBookMe/react-datetime which itself was a fork of https://github.com/quri/react-bootstrap-datetimepicker but the code and the API has changed a lot.

## Installation

Install using npm:

```sh
npm install --save @nateradebaugh/react-datetime
```

Install using yarn:

```sh
yarn add @nateradebaugh/react-datetime
```

## Usage

[React](https://reactjs.org/) is a peer dependency for react-datetime. It is not installed along with react-datetime automatically, but your project needs to have it installed in order to make the datepicker work. You can then use the datepicker like in the example below.

**Note:** [date-fns](https://github.com/date-fns/date-fns) v2 is an internal dependency of the component. This means `dateFormat` and `timeFormat` must be supported in v2. Feel free to use whatever version of date stuff you want outside of this component.

**Note 2:** The latest versions of @nateradebaugh/react-datetime only support controlled components. This means you need a `value` and `onChange` prop for the picker to work as expected!

```js
import DateTime from "@nateradebaugh/react-datetime";
import "@nateradebaugh/react-datetime/scss/styles.scss";

...

function ExampleWrapper() {
    const [value, setValue] = React.useState(new Date());

    return <DateTime value={value} onChange={setValue} />;
}
```

**Don't forget to import the [SCSS stylesheet](https://github.com/NateRadebaugh/react-datetime/blob/main/scss/styles.scss) to make it work out of the box.**

## API

| Name                | Type                                                                                                                                                                             | Default                                                                                         | Description                                                                                                                                                                                                                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **value**           | `string` or `Date`                                                                                                                                                               | `new Date()`                                                                                    | Represents the selected date by the component. When `string`, the format must match the date/time formats to be considered "selected".                                                                                                                                                           |
| **onChange**        | `function`                                                                                                                                                                       | empty function                                                                                  | Callback trigger when the selected date/typed value changes. The callback receives the selected `Date` object as only parameter, if the date in the input matches the expected date/time format. If the date in the input is not valid, the callback receives the value of the input (a string). |
| **dateFormat**      | `boolean` or `string`                                                                                                                                                            | `true`                                                                                          | Defines the format to use for the date based on date-fns support. If `true` the date will be displayed using a default date format. If `false` the datepicker is disabled.                                                                                                                       |
| **timeFormat**      | `boolean` or `string`                                                                                                                                                            | `true`                                                                                          | Defines the format for the time based on date-fns support. If `true` the time will be displayed using the default time format. If `false` the timepicker is disabled.                                                                                                                            |
| **timeConstraints** | `object`                                                                                                                                                                         | `{ hours: { step: 1 }, minutes: { step: 1 }, seconds: { step: 1 }, milliseconds: { step: 1 } }` | Defines the step size for the up/down arrows in the time picker.                                                                                                                                                                                                                                 |
| **locale**          | date-fns locale                                                                                                                                                                  | `undefined`                                                                                     | Manually set the date-fns locale for the react-datetime instance.                                                                                                                                                                                                                                |
| **weekStartsOn**    | date-fns weekStartsOn                                                                                                                                                            | `undefined`                                                                                     | Manually set the date-fns weekStartsOn for the react-datetime instance.                                                                                                                                                                                                                          |
| **isValidDate**     | `function`                                                                                                                                                                       | `() => true`                                                                                    | Define the dates that can be selected. The function receives `(currentDate, selectedDate)` and shall return a `true` or `false` whether the `currentDate` is valid or not.                                                                                                                       |
| **dateTypeMode**    | <ul><li>`undefined` (Date),</li><li>`utc-ms-timestamp` (Number of milliseconds since the Unix Epoch),</li><li>`input-format` (`dateFormat timeFormat`),</li><li>`Date`</li></ul> | `Date`                                                                                          | Configure the `onChange` callback to send various formats, instead of the native `Date` type                                                                                                                                                                                                     |

## Customize appearance

It is possible to customize the way that the input displays using `className`, `styles`, and other properties found on `input` elements.

## Specify available picker modes via `dateFormat` and `timeFormat` props

By default (and with both as `true`), both date and times are options. Set to `false` to disable date or times.

```js
<DateTime dateFormat={false} />
```

```js
<DateTime dateFormat="yyyy-LL" timeFormat={false} />
```

You can also import `FORMATS` for formating strings.

```js
import DateTime, { FORMATS } from "@nateradebaugh/react-datetime";

<DateTime dateFormat={`${FORMATS.YEAR}-${FORMATS.MONTH}`} timeFormat={false} />;
```

## Selectable Dates

It is possible to disable dates in the calendar if the user are not allowed to select them, e.g. dates in the past. This is done using the prop `isValidDate`, which admits a function in the form `function(currentDate, selectedDate)` where both arguments are native `Date` objects. The function should return `true` for selectable dates, and `false` for disabled ones.

In the example below are _all dates before today_ disabled.

```js
import subDays from "date-fns/subDays";
import isAfter from "date-fns/isAfter";

const yesterday = subDays(new Date(), 1);
const isValidDate = function (current) {
  return isAfter(current, yesterday);
};

<DateTime isValidDate={valid} />;
```

It's also possible to disable _the weekends_, as shown in the example below.

```js
import isWeekend from "date-fns/isWeekend";

const isValidDate = function (current) {
  return !isWeekend(current);
};

<DateTime isValidDate={isValidDate} />;
```

## i18n

Different language and date formats are supported by `react-datetime`. `react-datetime` uses [date-fns](https://date-fns.org/) to format the dates, and the easiest way of changing the language of the calendar is providing a `locale` prop. See date-fns documentation here: [changing the date-fns locale](https://date-fns.org/v2.3.0/docs/I18n).

You can then use the prop `locale` to define what language shall be used by the instance.

```js
<DateTime locale={nl} />
<DateTime locale={es} />
<DateTime locale={fr} />
```

## Contributions

For information about how to contribute, see the [CONTRIBUTING](.github/CONTRIBUTING.md) file.

### [Changelog](CHANGELOG.md)

### [MIT Licensed](LICENSE.md)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://naterad.com"><img src="https://avatars1.githubusercontent.com/u/130445?v=4" width="100px;" alt=""/><br /><sub><b>Nate Radebaugh</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=NateRadebaugh" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/simeg"><img src="https://avatars0.githubusercontent.com/u/8566054?v=4" width="100px;" alt=""/><br /><sub><b>Simon Egersand</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=simeg" title="Code">💻</a></td>
    <td align="center"><a href="http://arqex.com"><img src="https://avatars2.githubusercontent.com/u/6509397?v=4" width="100px;" alt=""/><br /><sub><b>Javier Marquez</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=arqex" title="Code">💻</a></td>
    <td align="center"><a href="http://loic.xxx"><img src="https://avatars0.githubusercontent.com/u/1869?v=4" width="100px;" alt=""/><br /><sub><b>Loïc CHOLLIER</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=chollier" title="Code">💻</a></td>
    <td align="center"><a href="http://www.lorisguignard.com"><img src="https://avatars0.githubusercontent.com/u/8362?v=4" width="100px;" alt=""/><br /><sub><b>Loris Guignard</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=loris" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/layneanderson"><img src="https://avatars3.githubusercontent.com/u/21086971?v=4" width="100px;" alt=""/><br /><sub><b>Layne Anderson</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=layneanderson" title="Code">💻</a></td>
    <td align="center"><a href="http://www.joshcarr.com"><img src="https://avatars1.githubusercontent.com/u/86731?v=4" width="100px;" alt=""/><br /><sub><b>Josh Carr</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=joshcarr" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.andjosh.com"><img src="https://avatars1.githubusercontent.com/u/2358584?v=4" width="100px;" alt=""/><br /><sub><b>Josh</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=andjosh" title="Code">💻</a></td>
    <td align="center"><a href="https://twitter.com/wadahiro"><img src="https://avatars0.githubusercontent.com/u/28739?v=4" width="100px;" alt=""/><br /><sub><b>Hiroyuki Wada</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=wadahiro" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/volkanunsal"><img src="https://avatars2.githubusercontent.com/u/151600?v=4" width="100px;" alt=""/><br /><sub><b>Volkan Unsal</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=volkanunsal" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/mattdell"><img src="https://avatars1.githubusercontent.com/u/2536442?v=4" width="100px;" alt=""/><br /><sub><b>Matt Dell</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=mattdell" title="Code">💻</a></td>
    <td align="center"><a href="http://kemcake.github.io"><img src="https://avatars0.githubusercontent.com/u/4311124?v=4" width="100px;" alt=""/><br /><sub><b>Rémi Santos</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=kemcake" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/jackdeadman"><img src="https://avatars2.githubusercontent.com/u/6359535?v=4" width="100px;" alt=""/><br /><sub><b>Jack Deadman</b></sub></a><br /><a href="https://github.com/NateRadebaugh/react-datetime/commits?author=jackdeadman" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
