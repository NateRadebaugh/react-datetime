import React, {
  Fragment,
  cloneElement,
  Children,
  useRef,
  forwardRef
} from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { useRect } from "@reach/rect";

import usePicker from "./usePicker";

// tslint:disable-next-line:no-shadowed-variable
export const PickerPopup = forwardRef(function PickerPopup(
  {
    // own props
    content, // could use children but want to encourage simple strings
    ariaLabel,
    position,

    // hook spread props
    isVisible,
    id,
    triggerRect,
    ...rest
  }: any,
  // tslint:disable-next-line:no-shadowed-variable
  forwardRef: any
) {
  return isVisible ? (
    <PickerContent
      content={content}
      ariaLabel={ariaLabel}
      position={position}
      isVisible={isVisible}
      id={id}
      triggerRect={triggerRect}
      ref={forwardRef}
      {...rest}
    />
  ) : null;
});

// tslint:disable-next-line:no-shadowed-variable
const PickerContent = forwardRef(function PickerContent(
  {
    content,
    ariaLabel,
    position = positionDefault,
    isVisible,
    id,
    triggerRect,
    style,
    ...rest
  }: any,
  // tslint:disable-next-line:no-shadowed-variable
  forwardRef: any
) {
  const useAriaLabel = ariaLabel != null;
  const pickerRef = useRef<any>();
  const pickerRect = useRect(pickerRef, isVisible);
  return (
    <Fragment>
      <div
        role={useAriaLabel ? undefined : "picker"}
        id={useAriaLabel ? undefined : id}
        children={content}
        style={{
          ...style,
          ...getStyles(position, triggerRect, pickerRect)
        }}
        ref={node => {
          pickerRef.current = node;
          if (forwardRef) {
            forwardRef(node);
          }
        }}
        {...rest}
      />
      {useAriaLabel && (
        <VisuallyHidden role="picker" id={id}>
          {ariaLabel}
        </VisuallyHidden>
      )}
    </Fragment>
  );
});

// feels awkward when it's perfectly aligned w/ the trigger
const OFFSET = 2;

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

const getStyles = (position, triggerRect: Rect, pickerRect: Rect) => {
  const haventMeasuredPickerYet = !pickerRect;
  if (haventMeasuredPickerYet) {
    return { visibility: "hidden" };
  }
  return position(triggerRect, pickerRect);
};

const positionDefault = (triggerRect: Rect, pickerRect: Rect) => {
  const styles = {
    left: `${triggerRect.left + window.scrollX}px`,
    top: `${triggerRect.top + triggerRect.height + window.scrollY}px`
  };

  const collisions = {
    top: triggerRect.top - pickerRect.height < 0,
    right: window.innerWidth < triggerRect.left + pickerRect.width,
    bottom:
      window.innerHeight < triggerRect.bottom + pickerRect.height + OFFSET,
    left: triggerRect.left - pickerRect.width < 0
  };

  const directionRight = collisions.right && !collisions.left;
  const directionUp = collisions.bottom && !collisions.top;

  return {
    position: "absolute",
    ...styles,
    left: directionRight
      ? `${triggerRect.right - pickerRect.width + window.scrollX}px`
      : `${triggerRect.left + window.scrollX}px`,
    top: directionUp
      ? `${triggerRect.top - OFFSET - pickerRect.height + window.scrollY}px`
      : `${triggerRect.top + OFFSET + triggerRect.height + window.scrollY}px`
  };
};

function Picker({ children, content, ariaLabel, isVisible, ...rest }: any) {
  const [trigger, picker] = usePicker({ isVisible: isVisible });

  return (
    <Fragment>
      {cloneElement(Children.only(children), trigger)}
      <PickerPopup
        content={content}
        ariaLabel={ariaLabel}
        {...picker}
        {...rest}
      />
    </Fragment>
  );
}

export default Picker;
