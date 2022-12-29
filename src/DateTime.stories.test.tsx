import * as React from "react";
import { render } from "@testing-library/react";

import * as stories from "./DateTime.stories";

test.each(
  Object.keys(stories).filter((name) => {
    // @ts-ignore
    const StoryComponent = stories[name];

    if (
      typeof StoryComponent === "function" ||
      ("render" in StoryComponent &&
        typeof StoryComponent.render === "function")
    ) {
      return true;
    }

    return false;
  })
)("should render %s story", (name) => {
  // @ts-ignore
  const StoryComponent = stories[name];

  if (
    "render" in StoryComponent &&
    typeof StoryComponent.render === "function"
  ) {
    const { render: Component, args } = StoryComponent;
    render(Component(args));
  } else {
    render(<StoryComponent {...StoryComponent.args} />);
  }
});
