import React from 'react'
import { useZoomImageHover } from '../utils'

const ZoomMyImageOnHover = () => {

    const { createZoomImage: createZoomImageHover } = useZoomImageHover()

    const imageHoverContainerRef = React.useRef<HTMLDivElement>(null)
    const zoomTargetRef = React.useRef<HTMLDivElement>(null)
    const imgRef = React.useRef<HTMLImageElement>(null)
    const [imageDimension, setImageDimensions] = React.useState({ width: 0, height: 0 });

    const handleImageLoad = () => {
        if (imgRef.current) {
            setImageDimensions({
                width: imgRef.current.naturalWidth,
                height: imgRef.current.naturalHeight,
            });
        }
    };

    React.useEffect(() => {
        const imageContainer = imageHoverContainerRef.current as HTMLDivElement
        const zoomTarget = zoomTargetRef.current as HTMLDivElement
        createZoomImageHover(
            imageContainer, {
            zoomImageSource: "https://m.media-amazon.com/images/I/61cXC1ZOlDL._AC_SL1500_.jpg",
            customZoom: { width: 500, height: 500 },
            zoomTarget,
            scale: 3,
        })
    }, [imageDimension, createZoomImageHover]);

    return (
        <div ref={imageHoverContainerRef} className="zoomByHoverContainer" style={{
            position: "relative", width: imageDimension?.width,
            height: imageDimension?.height,
            display: "flex", justifyItems: "start",
        }}
        >
            <img onLoad={handleImageLoad} ref={imgRef as React.RefObject<HTMLImageElement>} style={{ height: "auto", width: "auto" }} alt="Small Pic"
                src="https://m.media-amazon.com/images/I/61cXC1ZOlDL._AC_SX466_.jpg" />
            <div ref={zoomTargetRef} id="zoomTargetedRef" style={{ position: "absolute", left: imageDimension?.width + 10 + "px", }} ></div>
        </div>
    )
}

export default ZoomMyImageOnHover
