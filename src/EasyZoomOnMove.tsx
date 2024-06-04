"use client"
import React from 'react'
import { useZoomImageMove } from './utils';
import { EasySkeleton } from './hooks/useSkeleton';

type EasyZoomOnMovePropsType = {
    /**
     * Delay timer in ms for knowingly applying delay on loader and enhancing user experience
     * @default 1600
    */
    delayTimer?: number;

    loadingIndicator?: React.ReactNode;
    mainImage: {
        width?: number;
        height?: number;
        src: string;
        alt?: string;
    };
    zoomImage: {
        src: string;
        alt?: string;
    };

}

type ImageDimensionType = {
    width: number;
    height: number
}


const EasyZoomOnMove = (props: EasyZoomOnMovePropsType) => {

    const { mainImage, zoomImage, loadingIndicator, delayTimer } = props;
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);
    const { createZoomImage: createZoomImageMove } = useZoomImageMove();
    const imageMoveContainerRef = React.useRef<HTMLDivElement>(null)
    const imgRef = React.useRef<HTMLImageElement>(null)
    const [imageDimension, setImageDimensions] = React.useState<ImageDimensionType>({ height: 0, width: 0 });

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


    React.useEffect(() => {
        if (imageDimension.width > 0 && imageDimension.height > 0) {


        }
        const imageContainer = imageMoveContainerRef.current as HTMLDivElement;
        if (imageContainer) {
            createZoomImageMove(imageContainer, {
                zoomImageSource: zoomImage.src,
                zoomImageProps: { alt: zoomImage.alt },
            });
        }
    }, [zoomImage.src, zoomImage.alt, createZoomImageMove]);

    const handleImageLoad = async () => {
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight,
            });
            await delay(delayTimer ?? 1600);  //delay for better user experience
            setIsImageLoaded(true);
        }
    };


    return (
        <>
            {!isImageLoaded && (loadingIndicator ??
                <EasySkeleton
                    height={props.mainImage.height ?? 450}
                    width={props.mainImage.width ?? 450}
                />
            )}
            <div ref={imageMoveContainerRef} className="EasyImageZoomOnMoveContainer"
                style={{
                    position: "relative", maxHeight: mainImage.height ?? imageDimension?.height ?? "auto",
                    maxWidth: mainImage.width ?? imageDimension?.width, overflow: "hidden",
                    cursor: "crosshair",
                    display: isImageLoaded ? "block" : "none",
                }}
            >
                <img className='EasyImageZoomOnMoveImage'
                    onLoad={handleImageLoad} ref={imgRef as React.RefObject<HTMLImageElement>}
                    style={{ width: "full", height: "full" }}
                    alt={mainImage.alt ?? "Large Pic"} src={mainImage.src} />
            </div>

        </>

    )
}

export default EasyZoomOnMove
