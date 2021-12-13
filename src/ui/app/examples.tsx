import React from "react";
import { App } from ".";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export const AppDefault: ComponentStory<typeof App> = () => <App />;

export default {
  title: "App",
  component: App,
} as ComponentMeta<typeof App>;
