import React from "react";
import { Piano } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof Piano> = (args) => (
  <Piano {...args} />
);

export default {
  title: "Piano Scene",
  component: Piano,
} as ComponentMeta<typeof Piano>;
