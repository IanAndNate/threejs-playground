import React from "react";
import { ReflectorScene } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof ReflectorScene> = (args) => (
  <ReflectorScene {...args} />
);

export default {
  title: "Reflector Scene",
  component: ReflectorScene,
} as ComponentMeta<typeof ReflectorScene>;
