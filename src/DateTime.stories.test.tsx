import * as React from "react";
import { render } from "@testing-library/react";

import * as stories from "./DateTime.stories";

test.each(
  // @ts-ignore
  Object.keys(stories).filter((name) => typeof stories[name] === "function")
)("should render %s story", (story) => {
  // @ts-ignore
  const StoryComponent = stories[story];

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
