import type { Meta, StoryObj } from "@storybook/react"
import { EasyZoomOnHover } from "../../index"

const meta = {
    title: "Components/ZoomOnHover",
    component: EasyZoomOnHover,
    args: {
        delayTimer: 0,
        distance: 10,
        zoomFactor: 3,
        lensScale: 1,
        disableScrollLock: true,
        zoomContainerWidth: 500,
        zoomContainerHeight: 500,
        mainImage: {
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX466_.jpg",
            alt: "Product",
            width: 466,
            height: 466,
        },
        zoomImage: {
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX1500_.jpg",
            alt: "Product enlarged",
        },
    },
    argTypes: {
        zoomFactor: {
            control: { type: "number", min: 1, step: 0.25 },
            description: "Magnification factor for the zoomed image.",
        },
        lensScale: {
            control: { type: "number", min: 0.25, step: 0.25 },
            description: "Physical size multiplier for the hover lens.",
        },
        disableScrollLock: {
            control: "boolean",
            description: "Keep page scrolling enabled while magnifying.",
        },
        zoomLensScale: {
            table: { disable: true },
            description: "Deprecated alias for zoomFactor.",
        },
        className: { control: "text" },
        imageClassName: { control: "text" },
        zoomContainerClassName: { control: "text" },
        zoomLensClassName: { control: "text" },
        zoomImageClassName: { control: "text" },
    },
} satisfies Meta<typeof EasyZoomOnHover>

export default meta
type Story = StoryObj<typeof meta>

export const ZoomImageOnHover: Story = {}
