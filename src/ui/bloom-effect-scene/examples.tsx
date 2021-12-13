import React from "react";
import { BloomEffectScene } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof BloomEffectScene> = (args) => (
  <BloomEffectScene {...args} />
);

export default {
  title: "Bloom Effect Scene",
  component: BloomEffectScene,
} as ComponentMeta<typeof BloomEffectScene>;
