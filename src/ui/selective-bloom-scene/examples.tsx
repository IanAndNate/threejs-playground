import React from "react";
import { SelectiveBloomScene } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof SelectiveBloomScene> = (args) => (
  <SelectiveBloomScene {...args} />
);

export default {
  title: "Selective Bloom Scene",
  component: SelectiveBloomScene,
} as ComponentMeta<typeof SelectiveBloomScene>;
