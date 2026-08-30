import { createStore } from "../hooks"
import { imageLoader } from "./imageLoader"
import { disableScroll, enableScroll, getSourceImage } from "./clamp"

export type ZoomedImgStatus = "idle" | "loading" | "loaded" | "error"

export type ZoomImageMoveOptions = {
    zoomFactor?: number
    zoomImageSource?: string
    disableScrollLock?: boolean
    zoomImageProps?: {
        alt?: string
        className?: string
    }
}

export type ZoomImageMoveState = {
    zoomedImgStatus: ZoomedImgStatus
}

function positiveNumberOr(value: number | undefined, fallback: number) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback
}

export function createZoomImageMove(container: HTMLElement, options: ZoomImageMoveOptions = {}) {
    const sourceImgElement = getSourceImage(container)
    const finalOptions: Omit<Required<ZoomImageMoveOptions>, "zoomImageProps"> = {
        zoomFactor: positiveNumberOr(options.zoomFactor, 4),
        zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
        disableScrollLock: options.disableScrollLock ?? false,
    }

    const { disableScrollLock, zoomFactor, zoomImageSource } = finalOptions

    const store = createStore<ZoomImageMoveState>({
        zoomedImgStatus: "idle",
    })

    const zoomedImg = container.appendChild(document.createElement("img"))
    zoomedImg.alt = options.zoomImageProps?.alt ?? ""
    zoomedImg.className = options.zoomImageProps?.className ?? ""
    zoomedImg.draggable = false
    zoomedImg.style.maxWidth = "none"
    zoomedImg.style.position = "absolute"
    zoomedImg.style.top = "0"
    zoomedImg.style.left = "0"
    zoomedImg.style.pointerEvents = "none"
    zoomedImg.style.display = "none"

    let scrollLocked = false

    function lockPageScroll() {
        if (!disableScrollLock && !scrollLocked) {
            disableScroll()
            scrollLocked = true
        }
    }

    function unlockPageScroll() {
        if (scrollLocked) {
            enableScroll()
            scrollLocked = false
        }
    }

    function handlePointerEnter(event: PointerEvent) {
        zoomedImg.style.display = "block"
        const zoomedImgWidth = sourceImgElement.clientWidth * zoomFactor
        const zoomedImgHeight = sourceImgElement.clientHeight * zoomFactor
        zoomedImg.style.width = `${zoomedImgWidth}px`
        zoomedImg.style.height = `${zoomedImgHeight}px`
        imageLoader.createZoomImage(zoomedImg, zoomImageSource, store)
        processZoom(event)
        lockPageScroll()
    }

    function handlePointerMove(event: PointerEvent) {
        processZoom(event)
    }

    function handlePointerLeave() {
        zoomedImg.style.display = "none"
        zoomedImg.style.transform = "none"
        unlockPageScroll()
    }

    const calculatePositionX = (newPositionX: number) => {
        const width = container.clientWidth
        if (newPositionX > 0) return 0
        if (newPositionX + width * zoomFactor < width) return -width * (zoomFactor - 1)
        return newPositionX
    }

    const calculatePositionY = (newPositionY: number) => {
        const height = container.clientHeight
        if (newPositionY > 0) return 0
        if (newPositionY + height * zoomFactor < height) return -height * (zoomFactor - 1)
        return newPositionY
    }

    function processZoom(event: PointerEvent) {
        zoomedImg.style.display = "block"

        const containerRect = container.getBoundingClientRect()
        const zoomPointX = event.clientX - containerRect.left
        const zoomPointY = event.clientY - containerRect.top

        const currentPositionX = calculatePositionX(-zoomPointX * zoomFactor + zoomPointX)
        const currentPositionY = calculatePositionY(-zoomPointY * zoomFactor + zoomPointY)
        zoomedImg.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px)`
    }

    const controller = new AbortController()
    const { signal } = controller
    container.addEventListener("pointerenter", handlePointerEnter, { signal })
    container.addEventListener("pointermove", handlePointerMove, { signal })
    container.addEventListener("pointerleave", handlePointerLeave, { signal })

    return {
        cleanup: () => {
            controller.abort()
            unlockPageScroll()
            container.contains(zoomedImg) && container.removeChild(zoomedImg)
            store.cleanup()
        },
        subscribe: store.subscribe,
        getState: store.getState,
    }
}
