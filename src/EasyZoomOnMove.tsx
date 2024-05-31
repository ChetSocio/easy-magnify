"use client"
import React from 'react'
import { useZoomImageMove } from './utils';

type EasyZoomOnMovePropsType = {
    mainImage: {
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
        const imageContainer = imageMoveContainerRef.current as HTMLDivElement;
        if (imageContainer) {
            createZoomImageMove(imageContainer, {
                zoomImageSource: props.zoomedImage.src,
                zoomImageProps: { alt: props.zoomedImage.alt },
            });
        }
    }, [props.zoomedImage.src, props.zoomedImage.alt, createZoomImageMove]);

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
                    position: "relative", height: props.mainImage.height ?? imageDimension?.height ?? "auto",
                    minWidth: props.mainImage.width ?? imageDimension?.width, overflow: "hidden",
                    cursor: "crosshair",
                }}
                className="EasyImageZoomOnMoveContainer ">
                <img className='EasyImageZoomOnMoveImage'
                    onLoad={handleImageLoad} ref={imgRef as React.RefObject<HTMLImageElement>}
                    style={{ width: "full", height: "full" }}
                    alt={props.mainImage.alt ?? "Large Pic"} src={props.mainImage.src} />
            </div>

        </>

    )
}

export default EasyZoomOnMove
