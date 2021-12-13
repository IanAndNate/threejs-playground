import React from "react";
import { InstancedMeshScene } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const Default: ComponentStory<typeof InstancedMeshScene> = (args) => (
  <InstancedMeshScene {...args} />
);

export default {
  title: "Instanced Mesh Scene",
  component: InstancedMeshScene,
} as ComponentMeta<typeof InstancedMeshScene>;
