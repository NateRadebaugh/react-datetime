import { useRef } from "react";
import { useRect } from "@reach/rect";
import { useId } from "@reach/auto-id";

function usePicker({ isVisible, ref }: any = {}) {
  const tRef = useRef();
  const triggerRef = ref || tRef;
  const triggerRect = useRect(triggerRef, isVisible);
  const id = `picker:${useId()}`;

  const trigger = {
    "aria-describedby": id,
    ref: triggerRef
  };

  const picker = {
    id: id,
    triggerRect: triggerRect,
    isVisible: isVisible
  };

  return [trigger, picker, isVisible];
}

export default usePicker;
