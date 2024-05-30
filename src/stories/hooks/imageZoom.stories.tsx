
import { StoryFn, Meta } from "@storybook/react";
import * as React from "react";
import { EasyZoomOnMove } from "../../index";


export default {
    title: "Components/ZoomOnMove",
    component: EasyZoomOnMove,

} as Meta<typeof EasyZoomOnMove>;


const Template: StoryFn<typeof EasyZoomOnMove> = (args) => <div style={{ display: "flex" }}>
    <EasyZoomOnMove
        image={{
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX466_.jpg",
            alt: "My Product"
        }}
        zoomedImage={{
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX1500_.jpg",
            alt: "My Product"
        }}
    />
    <div style={{ marginLeft: "20px" }}>
        <h1>Logitech G305 LIGHTSPEED Wireless Gaming Mouse, Hero 12K Sensor, 12,000 DPI, Lightweight, - Black
        </h1>
    </div>

</div>;

export const ZoomImageOnMove = Template.bind({});