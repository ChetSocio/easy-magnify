
import { StoryFn, Meta } from "@storybook/react";
import * as React from "react";
import { EasyZoomOnHover } from "../../index";


export default {
    title: "Components/ZoomOnHover",
    component: EasyZoomOnHover,

} as Meta<typeof EasyZoomOnHover>;


const Template: StoryFn<typeof EasyZoomOnHover> = (args) => <div style={{ display: "flex" }}>
    <EasyZoomOnHover
        mainImage={{
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX466_.jpg",
            alt: "My Product"
        }}
        zoomedImage={{
            scale: 4, src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX1500_.jpg",
            alt: "My Product Zoom", width: 500, height: 500
        }}
    />
    <div style={{ marginLeft: "20px" }}>
        <h1>Logitech G305 LIGHTSPEED Wireless Gaming Mouse, Hero 12K Sensor, 12,000 DPI, Lightweight, - Black
        </h1>
    </div>

</div>;

export const ZoomImageOnHover = Template.bind({});