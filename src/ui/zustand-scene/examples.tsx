import React from "react";
import { ZustandScene } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof ZustandScene> = (args) => (
  <ZustandScene {...args} />
);

export default {
  title: "Zustand Scene",
  component: ZustandScene,
} as ComponentMeta<typeof ZustandScene>;
