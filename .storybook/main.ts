import type { StorybookConfig } from "@storybook/react-webpack5";
const path = require('path')

const config: StorybookConfig = {

  stories: [
    '../src/stories/intro.mdx',
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    '@storybook/addon-styling-webpack',
    'storybook-dark-mode',
    '@storybook/addon-docs',
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
