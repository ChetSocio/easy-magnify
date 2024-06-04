"use client";
import React from 'react';
import { useZoomImageHover } from './utils';
import { EasySkeleton } from './hooks/useSkeleton';


export type EasyZoomOnHoverProps = {

    /**
     * Delay timer in ms for knowingly applying delay on loader and enhancing user experience
     * @default 1600
     */
    delayTimer?: number;

    /**
     * The distance between main image and zoomed Image in pixels. 
     * @default 10
     */
    distance?: number;

    /**
     * The loading indicator to show when the image is loading. Provides extra user experience.
     * default: EasySkeleton with height={500} and width={500}
     */
    loadingIndicator?: React.ReactNode;
    mainImage: {
        width?: number;
        height?: number;
        src: string;
        alt?: string;
    }
    zoomImage: {
        src: string;
        alt?: string;
    }
    zoomContainerWidth?: number;
    zoomContainerHeight?: number;
    zoomLensScale?: number;
}

export type ImageDimensionType = {
    height: number;
    width: number;
}


const EasyZoomOnHover = React.forwardRef(function EasyZoomOnHover(props: EasyZoomOnHoverProps, ref: React.Ref<HTMLDivElement>) {

    const { mainImage, zoomImage, loadingIndicator, delayTimer, distance = 10, zoomContainerWidth } = props;
    const { createZoomImage: createZoomImageHover } = useZoomImageHover();

    const imageHoverContainerRef = React.useRef<HTMLDivElement>(null);
    const zoomTargetRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);

    const [imageDimension, setImageDimensions] = React.useState<ImageDimensionType>({ height: 0, width: 0 });
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

    React.useEffect(() => {
        if (imageDimension.width > 0 && imageDimension.height > 0) {
            const imageContainer = imageHoverContainerRef.current as HTMLDivElement;
            const zoomTarget = zoomTargetRef.current as HTMLDivElement;
            createZoomImageHover(
                imageContainer, {
                zoomImageSource: zoomImage.src ?? mainImage.src,
                customZoom: {
                    width: props.zoomContainerWidth ?? imageDimension.width ?? 450,
                    height: props.zoomContainerHeight ?? imageDimension.height ?? 470
                },
                zoomTarget,
                scale: props.zoomLensScale ?? 3,
            });
        }
    }, [isImageLoaded, imageDimension]);

    return (
        <>
            {!isImageLoaded && (loadingIndicator ??
                <EasySkeleton
                    height={props.mainImage.height ?? 450}
                    width={props.mainImage.width ?? 450}
                />
            )}
            <div
                ref={imageHoverContainerRef}
                className="EasyZoomImageHoverMainContainer"
                style={{
                    position: "relative",
                    width: props.mainImage.width ?? imageDimension.width,
                    height: props.mainImage.height ?? imageDimension.height,
                    display: isImageLoaded ? "flex" : "none",
                    justifyItems: "start",
                }}
            >
                <img
                    className="EasyZoomHoverSmallImage"
                    onLoad={handleImageLoad}
                    ref={imgRef}
                    style={{ height: "auto", width: "auto" }}
                    alt={mainImage.alt ?? "Small Pic"}
                    src={mainImage.src}
                />

                <div
                    ref={zoomTargetRef}
                    className="EasyZoomImageZoomHoverContainer"
                    id="zoomTargeted"
                    style={{
                        position: "absolute",
                        maxWidth: zoomContainerWidth ?? "450px",
                        left: `${mainImage.width ? mainImage.width + distance : imageDimension.width + distance}px`,
                    }}
                ></div>
            </div>
        </>
    )
})

export default EasyZoomOnHover;
