import React from 'react';
import { useZoomImageHover } from './utils';

export type EasyZoomOnHoverProps = {
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


const EasyZoomOnHover = (props: EasyZoomOnHoverProps) => {

    const { mainImage, zoomImage } = props;

    const { createZoomImage: createZoomImageHover } = useZoomImageHover();

    const imageHoverContainerRef = React.useRef<HTMLDivElement>(null);
    const zoomTargetRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);
    const [imageDimension, setImageDimensions] = React.useState({ width: 0, height: 0 });
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);

    const handleImageLoad = () => {
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight,
            });
            setIsImageLoaded(true);
        }
    };

    React.useEffect(() => {
        if (isImageLoaded && imageDimension.width > 0 && imageDimension.height > 0) {
            const imageContainer = imageHoverContainerRef.current as HTMLDivElement;
            const zoomTarget = zoomTargetRef.current as HTMLDivElement;
            createZoomImageHover(
                imageContainer, {
                zoomImageSource: zoomImage.src ?? mainImage.src,
                customZoom: { width: props.zoomContainerWidth ?? 500, height: props.zoomContainerHeight ?? 500 },
                zoomTarget,
                scale: props.zoomLensScale ?? 3,
            });
        }
    }, [isImageLoaded, imageDimension, createZoomImageHover]);

    return (
        <div ref={imageHoverContainerRef} className='EasyZoomImageHoverMainContainer' style={{
            position: "relative", minWidth: props.mainImage.width ?? imageDimension?.width,
            height: props.mainImage.height ?? imageDimension?.height,
            display: "flex", justifyItems: "start",
        }}>
            <img className='EasyZoomHoverSmallImage'
                onLoad={handleImageLoad}
                ref={imgRef}
                style={{ height: "auto", width: "auto" }}
                alt={mainImage.alt ?? "Small Pic"}
                src={mainImage.src}
            />
            <div ref={zoomTargetRef} className="EasyZoomImageZoomHoverContainer" id="zoomTargetedRef"
                style={{
                    position: "absolute",
                    left: imageDimension?.width + 10 + "px",
                }}></div>
        </div>
    );
}

export default EasyZoomOnHover;
