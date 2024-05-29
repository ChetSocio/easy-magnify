
import { StoryFn, Meta } from "@storybook/react";
import UseMouseDemo from '../../components/UseMouseDemo';
import * as React from "react";

export default {
    title: "Components/UseMouseDemo",
    component: UseMouseDemo,
    argTypes: {

    },
} as Meta<typeof UseMouseDemo>;

const Template: StoryFn<typeof UseMouseDemo> = (args) => <UseMouseDemo />;

export const UseMouseDemoTest = Template.bind({});
