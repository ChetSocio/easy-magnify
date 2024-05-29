"use client"
import React from 'react'
import { useZoomImageHover } from './utils'

type EasyZoomOnHoverPropsType = {
    mainImage: {
        width?: number;
        height?: number;
        scale?: number
        src: string;
        alt?: string;
    };
    zoomedImage?: {
        width?: number;
        height?: number;
        scale?: number
        src: string;
        alt?: string;
    };
}


const EasyZoomOnHover = (props: EasyZoomOnHoverPropsType) => {


    const { createZoomImage: createZoomImageHover } = useZoomImageHover();

    const imageHoverContainerRef = React.useRef<HTMLDivElement>(null)
    const zoomTargetRef = React.useRef<HTMLDivElement>(null)
    const imgRef = React.useRef<HTMLImageElement>(null)
    const [imageDimension, setImageDimensions] = React.useState({ width: 0, height: 0 });

    React.useEffect(() => {

        const imageContainer = imageHoverContainerRef.current as HTMLDivElement
        const zoomTarget = zoomTargetRef.current as HTMLDivElement
        createZoomImageHover(
            imageContainer, {
            zoomImageSource: props.zoomedImage?.src || props.mainImage.src,
            customZoom: { width: props.zoomedImage?.width ?? 500, height: props.zoomedImage?.height ?? 500 },
            zoomTarget,
            scale: props.zoomedImage?.scale || 2,
        })
    }, [])

    const handleImageLoad = () => {
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight,
            });
        }
    };
    const handleImageMouseEnter = () => {
        if (zoomTargetRef.current) {
            zoomTargetRef.current.style.border = "2px solid #6B7280";
            zoomTargetRef.current.style.boxShadow = 'rgb(101 100 100 / 86%) 0px 4px 6px -1px, rgb(136 135 135 / 92%) 0px 2px 4px -1px';
        }
    };
    const handleImageMouseLeave = () => {
        if (zoomTargetRef.current) {
            zoomTargetRef.current.style.border = "none";
            zoomTargetRef.current.style.boxShadow = 'none';
        }
    };
    return (
        <>
            <div ref={imageHoverContainerRef}
                onMouseEnter={handleImageMouseEnter}
                onMouseLeave={handleImageMouseLeave}
                style={{
                    position: "relative", width: imageDimension?.width,
                    height: imageDimension?.height,
                    display: "flex", justifyItems: "start",
                }
                }
            >
                <img

                    onLoad={handleImageLoad} ref={imgRef as React.RefObject<HTMLImageElement>}
                    style={{ height: "auto", width: "auto", }}
                    alt={props.mainImage.alt ?? "Product Main Image"} src={props.mainImage.src ?? ""} />
                <div ref={zoomTargetRef} id="zoomTargetedRef" style={{
                    position: "absolute", left: imageDimension?.width + 10 + "px",
                }} ></div>
            </div>
        </>
    )
}

export default EasyZoomOnHover
