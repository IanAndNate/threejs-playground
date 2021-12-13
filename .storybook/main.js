module.exports = {
  stories: ["../src/**/examples.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "storybook-addon-turbo-build",
      options: {
        // Please refer below tables for available options
        optimizationLevel: 3,
      },
    },
  ],
};
