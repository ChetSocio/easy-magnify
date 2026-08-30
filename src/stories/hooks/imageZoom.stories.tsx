import type { Meta, StoryObj } from "@storybook/react"
import { EasyZoomOnMove } from "../../index"

const meta = {
    title: "Components/ZoomOnMove",
    component: EasyZoomOnMove,
    args: {
        delayTimer: 0,
        zoomFactor: 4,
        disableScrollLock: true,
        mainImage: {
            src: "https://m.media-amazon.com/images/I/61vThyaOrHL._AC_SX466_.jpg",
            alt: "Product",
            width: 466,
            height: 466,
        },
        zoomImage: {
            src: "https://m.media-amazon.com/images/I/61vThyaOrHL._AC_SX1500_.jpg",
            alt: "Product enlarged",
        },
    },
    argTypes: {
        zoomFactor: {
            control: { type: "number", min: 1, step: 0.25 },
            description: "Magnification factor for the generated zoom image.",
        },
        disableScrollLock: {
            control: "boolean",
            description: "Keep page scrolling enabled while magnifying.",
        },
        className: {
            control: "text",
            description: "Additional class for the source-image container.",
        },
        imageClassName: {
            control: "text",
            description: "Additional class for the source image.",
        },
        zoomImageClassName: {
            control: "text",
            description: "Class applied to the generated zoom image.",
        },
    },
} satisfies Meta<typeof EasyZoomOnMove>

export default meta
type Story = StoryObj<typeof meta>

export const ZoomImageOnMove: Story = {}
