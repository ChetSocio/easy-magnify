
import { StoryFn, Meta } from "@storybook/react";
import * as React from "react";
import { EasyZoomOnMove } from "../../index";


export default {
    title: "Components/ZoomOnMove",
    component: EasyZoomOnMove,
    args: {

    }

} as Meta<typeof EasyZoomOnMove>;


const Template: StoryFn<typeof EasyZoomOnMove> = (args) => <div style={{ display: "flex" }}>
    <EasyZoomOnMove image={{
        src: "https://m.media-amazon.com/images/I/61vThyaOrHL._AC_SX466_.jpg",
        alt: "My Product",
        width: 466,
        height: 466
    }}
        zoomedImage={{
            src: "https://m.media-amazon.com/images/I/61vThyaOrHL._AC_SX1500_.jpg",
            alt: "My Product",
        }}

    />
    <div style={{ marginLeft: "20px" }}>
        <h1 className="text-2xl font-semibold ">Logitech G305 LIGHTSPEED Wireless Gaming Mouse, Hero 12K Sensor, 12,000 DPI, Lightweight, - Black
        </h1>
        <p>Price: $49.99</p>
        <p>Brand: Logitech</p>
        <p>Color: Black</p>
        <p>Connectivity Technology: Wireless</p>
    </div>


</div>;

export const ZoomImageOnMove = Template.bind({});