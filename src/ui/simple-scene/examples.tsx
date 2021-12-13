import React from "react";
import { SimpleScene } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof SimpleScene> = (args) => (
  <SimpleScene {...args} />
);

export default {
  title: "Simple Scene",
  component: SimpleScene,
  args: {
    color: "red",
  },
} as ComponentMeta<typeof SimpleScene>;
