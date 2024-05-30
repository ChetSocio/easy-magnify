"use client"
import React from 'react'
import { useZoomImageMove } from './utils';

type EasyZoomOnMovePropsType = {
    image: {
        width?: number;
        height?: number;
        src: string;
        alt?: string;
    };
    zoomedImage: {
        src: string;
        alt?: string;
    };

}

type ImageDimensionType = {
    width: number;
    height: number
}

const EasyZoomOnMove = (props: EasyZoomOnMovePropsType) => {


    const { createZoomImage: createZoomImageMove } = useZoomImageMove();
    const imageMoveContainerRef = React.useRef<HTMLDivElement>(null)
    const imgRef = React.useRef<HTMLImageElement>(null)
    const [imageDimension, setImageDimensions] = React.useState<ImageDimensionType | null>(null);

    React.useEffect(() => {

        const imageContainer = imageMoveContainerRef.current as HTMLDivElement
        createZoomImageMove(imageContainer, {
            zoomImageSource: props.zoomedImage.src,
            zoomImageProps: { alt: props.zoomedImage.alt },

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

    return (
        <>
            <div ref={imageMoveContainerRef}
                style={{
                    position: "relative", height: props.image.height ?? imageDimension?.height ?? "auto",
                    minWidth: props.image.width ?? imageDimension?.width, overflow: "hidden",
                    cursor: "crosshair",
                }}
                className="imageMoveContainer ">
                <img
                    onLoad={handleImageLoad} ref={imgRef as React.RefObject<HTMLImageElement>}
                    style={{ width: "full", height: "full" }}
                    alt={props.image.alt ?? "Large Pic"} src={props.image.src} />
            </div>

        </>

    )
}

export default EasyZoomOnMove
