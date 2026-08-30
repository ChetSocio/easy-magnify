"use client"
import React from "react"
import { useZoomImageMove } from "./utils"
import { EasySkeleton } from "./hooks/useSkeleton"

export type EasyZoomOnMoveProps = {
    /** Delay before revealing the loaded image, in milliseconds. @default 1600 */
    delayTimer?: number
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
    /** Magnification factor. @default 4 */
    zoomFactor?: number
    /** @deprecated Use zoomFactor. Retained for compatibility with lens-scale requests. */
    zoomLensScale?: number
    /**
     * When true, page scrolling remains enabled while the pointer is over the image.
     * @default true
     */
    disableScrollLock?: boolean
    className?: string
    style?: React.CSSProperties
    imageClassName?: string
    imageStyle?: React.CSSProperties
    zoomImageClassName?: string
}

/** @deprecated Use EasyZoomOnMoveProps. */
export type EasyZoomOnMovePropsType = EasyZoomOnMoveProps

type ImageDimensionType = {
    width: number
    height: number
}

function joinClassNames(...classNames: Array<string | undefined>) {
    return classNames.filter(Boolean).join(" ")
}

const EasyZoomOnMove = React.forwardRef<HTMLDivElement, EasyZoomOnMoveProps>(function EasyZoomOnMove(props, forwardedRef) {
    const {
        mainImage,
        zoomImage,
        loadingIndicator,
        delayTimer = 1600,
        zoomFactor,
        zoomLensScale,
        disableScrollLock = true,
        className,
        style,
        imageClassName,
        imageStyle,
        zoomImageClassName,
    } = props

    const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null)
    const isImageLoaded = loadedSrc === mainImage.src
    const [imageDimension, setImageDimensions] = React.useState<ImageDimensionType>({ height: 0, width: 0 })
    const { createZoomImage: createZoomImageMove } = useZoomImageMove()
    const imageMoveContainerRef = React.useRef<HTMLDivElement>(null)
    const imgRef = React.useRef<HTMLImageElement>(null)
    const revealTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useImperativeHandle(forwardedRef, () => imageMoveContainerRef.current as HTMLDivElement, [])

    const clearRevealTimer = React.useCallback(() => {
        if (revealTimerRef.current) {
            clearTimeout(revealTimerRef.current)
            revealTimerRef.current = null
        }
    }, [])

    React.useEffect(() => clearRevealTimer, [clearRevealTimer])

    React.useEffect(() => {
        const imageContainer = imageMoveContainerRef.current
        if (!isImageLoaded || !imageContainer) return

        createZoomImageMove(imageContainer, {
            zoomFactor: zoomFactor ?? zoomLensScale ?? 4,
            zoomImageSource: zoomImage.src,
            disableScrollLock,
            zoomImageProps: {
                alt: zoomImage.alt,
                className: zoomImageClassName,
            },
        })
    }, [
        createZoomImageMove,
        disableScrollLock,
        isImageLoaded,
        zoomFactor,
        zoomImage.alt,
        zoomImage.src,
        zoomImageClassName,
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
    const resolvedHeight = mainImage.height ?? undefined

    return (
        <>
            {!isImageLoaded && (loadingIndicator ?? (
                <EasySkeleton
                    height={mainImage.height ?? 450}
                    width={mainImage.width ?? 450}
                />
            ))}
            <div
                ref={imageMoveContainerRef}
                className={joinClassNames("EasyImageZoomOnMoveContainer", className)}
                style={{
                    position: "relative",
                    width: resolvedWidth,
                    height: resolvedHeight,
                    maxWidth: "100%",
                    overflow: "hidden",
                    cursor: "crosshair",
                    display: isImageLoaded ? "block" : "none",
                    ...style,
                }}
            >
                <img
                    className={joinClassNames("EasyImageZoomOnMoveImage", imageClassName)}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    ref={imgRef}
                    style={{
                        display: "block",
                        width: "100%",
                        height: resolvedHeight ? "100%" : "auto",
                        objectFit: "contain",
                        ...imageStyle,
                    }}
                    alt={mainImage.alt ?? ""}
                    src={mainImage.src}
                />
            </div>
        </>
    )
})

EasyZoomOnMove.displayName = "EasyZoomOnMove"

export default EasyZoomOnMove
