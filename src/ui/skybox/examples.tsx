import React from "react";
import { SkyboxScene } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof SkyboxScene> = (args) => (
  <SkyboxScene {...args} />
);

export default {
  title: "Skybox Scene",
  component: SkyboxScene,
} as ComponentMeta<typeof SkyboxScene>;
