import React from "react";
import { CustomRenderer } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof CustomRenderer> = (args) => (
  <CustomRenderer {...args} />
);

export default {
  title: "Custom Renderer Scene",
  component: CustomRenderer,
} as ComponentMeta<typeof CustomRenderer>;
