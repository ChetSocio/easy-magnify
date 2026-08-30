"use client"
import React from "react"
import { useZoomImageHover } from "./utils"
import { EasySkeleton } from "./hooks/useSkeleton"

export type EasyZoomOnHoverProps = {
    /** Delay before revealing the loaded image, in milliseconds. @default 1600 */
    delayTimer?: number
    /** Distance between the source image and zoom container, in pixels. @default 10 */
    distance?: number
    loadingIndicator?: React.ReactNode
    mainImage: {
        width?: number
        height?: number
        src: string
        alt?: string
    }
    zoomImage: {
        src: string
        alt?: string
    }
    zoomContainerWidth?: number
    zoomContainerHeight?: number
    /** Magnification factor. @default 3 */
    zoomFactor?: number
    /**
     * Legacy alias for zoomFactor. Kept backward-compatible with existing releases.
     * @deprecated Use zoomFactor.
     */
    zoomLensScale?: number
    /** Scale the physical hover lens without changing the public zoomFactor API. @default 1 */
    lensScale?: number
    /**
     * When true, page scrolling remains enabled while the pointer is over the image.
     * @default true
     */
    disableScrollLock?: boolean
    className?: string
    style?: React.CSSProperties
    imageClassName?: string
    imageStyle?: React.CSSProperties
    zoomContainerClassName?: string
    zoomContainerStyle?: React.CSSProperties
    zoomLensClassName?: string
    zoomImageClassName?: string
}

export type ImageDimensionType = {
    height: number
    width: number
}

function joinClassNames(...classNames: Array<string | undefined>) {
    return classNames.filter(Boolean).join(" ")
}

const EasyZoomOnHover = React.forwardRef<HTMLDivElement, EasyZoomOnHoverProps>(function EasyZoomOnHover(props, forwardedRef) {
    const {
        mainImage,
        zoomImage,
        loadingIndicator,
        delayTimer = 1600,
        distance = 10,
        zoomContainerWidth,
        zoomContainerHeight,
        zoomFactor,
        zoomLensScale,
        lensScale = 1,
        disableScrollLock = true,
        className,
        style,
        imageClassName,
        imageStyle,
        zoomContainerClassName,
        zoomContainerStyle,
        zoomLensClassName,
        zoomImageClassName,
    } = props

    const { createZoomImage: createZoomImageHover } = useZoomImageHover()
    const imageHoverContainerRef = React.useRef<HTMLDivElement>(null)
    const zoomTargetRef = React.useRef<HTMLDivElement>(null)
    const imgRef = React.useRef<HTMLImageElement>(null)
    const revealTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const [imageDimension, setImageDimensions] = React.useState<ImageDimensionType>({ height: 0, width: 0 })
    const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null)
    const isImageLoaded = loadedSrc === mainImage.src

    React.useImperativeHandle(forwardedRef, () => imageHoverContainerRef.current as HTMLDivElement, [])

    const clearRevealTimer = React.useCallback(() => {
        if (revealTimerRef.current) {
            clearTimeout(revealTimerRef.current)
            revealTimerRef.current = null
        }
    }, [])

    React.useEffect(() => clearRevealTimer, [clearRevealTimer])

    React.useEffect(() => {
        const imageContainer = imageHoverContainerRef.current
        const zoomTarget = zoomTargetRef.current
        if (!isImageLoaded || !imageContainer || !zoomTarget || !imageDimension.width || !imageDimension.height) return

        createZoomImageHover(imageContainer, {
            zoomImageSource: zoomImage.src || mainImage.src,
            zoomImageProps: {
                alt: zoomImage.alt,
                className: zoomImageClassName,
            },
            customZoom: {
                width: zoomContainerWidth ?? imageDimension.width,
                height: zoomContainerHeight ?? imageDimension.height,
            },
            zoomTarget,
            scale: zoomFactor ?? zoomLensScale ?? 3,
            zoomLensScale: lensScale,
            zoomLensClass: zoomLensClassName,
            disableScrollLock,
        })
    }, [
        createZoomImageHover,
        disableScrollLock,
        imageDimension.height,
        imageDimension.width,
        isImageLoaded,
        lensScale,
        mainImage.src,
        zoomContainerHeight,
        zoomContainerWidth,
        zoomFactor,
        zoomImage.alt,
        zoomImage.src,
        zoomImageClassName,
        zoomLensClassName,
        zoomLensScale,
    ])

    const handleImageLoad = React.useCallback(() => {
        const image = imgRef.current
        if (!image) return

        setImageDimensions({
            width: image.naturalWidth,
            height: image.naturalHeight,
        })

        clearRevealTimer()
        const sourceAtLoad = mainImage.src
        const revealDelay = Number.isFinite(delayTimer) ? Math.max(0, delayTimer) : 1600
        revealTimerRef.current = setTimeout(() => {
            setLoadedSrc(sourceAtLoad)
            revealTimerRef.current = null
        }, revealDelay)
    }, [clearRevealTimer, delayTimer, mainImage.src])

    const handleImageError = React.useCallback(() => {
        clearRevealTimer()
        setLoadedSrc(mainImage.src)
    }, [clearRevealTimer, mainImage.src])

    const resolvedWidth = mainImage.width ?? (imageDimension.width || undefined)
    const resolvedHeight = mainImage.height ?? (imageDimension.height || undefined)
    const resolvedZoomWidth = zoomContainerWidth ?? imageDimension.width

    return (
        <>
            {!isImageLoaded && (loadingIndicator ?? (
                <EasySkeleton
                    height={mainImage.height ?? 450}
                    width={mainImage.width ?? 450}
                />
            ))}
            <div
                ref={imageHoverContainerRef}
                className={joinClassNames("EasyZoomImageHoverMainContainer", className)}
                style={{
                    position: "relative",
                    width: resolvedWidth,
                    height: resolvedHeight,
                    maxWidth: "100%",
                    display: isImageLoaded ? "block" : "none",
                    cursor: "crosshair",
                    ...style,
                }}
            >
                <img
                    className={joinClassNames("EasyZoomHoverSmallImage", imageClassName)}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    ref={imgRef}
                    style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        ...imageStyle,
                    }}
                    alt={mainImage.alt ?? ""}
                    src={mainImage.src}
                />

                <div
                    ref={zoomTargetRef}
                    className={joinClassNames("EasyZoomImageZoomHoverContainer", zoomContainerClassName)}
                    style={{
                        position: "absolute",
                        width: resolvedZoomWidth,
                        maxWidth: resolvedZoomWidth,
                        left: `${(mainImage.width ?? imageDimension.width) + distance}px`,
                        top: 0,
                        ...zoomContainerStyle,
                    }}
                />
            </div>
        </>
    )
})

EasyZoomOnHover.displayName = "EasyZoomOnHover"

export default EasyZoomOnHover
