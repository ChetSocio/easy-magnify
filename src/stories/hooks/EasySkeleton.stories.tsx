
import { StoryFn, Meta } from "@storybook/react";
import * as React from "react";
import { EasySkeleton } from "../../index";


export default {
    title: "Components/EasySkeleton",
    component: EasySkeleton,
    args: {

    }

} as Meta<typeof EasySkeleton>;


const Template: StoryFn<typeof EasySkeleton> = (args) => <div style={{ display: "flex" }}>
    <EasySkeleton {...args} height={args.height ?? 450} width={args.width ?? 450}
    />


</div>;

export const EasySkeletons = Template.bind({});