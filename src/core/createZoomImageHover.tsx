import { createStore } from "../hooks"
import { imageLoader } from "./imageLoader"
import { clamp, disableScroll, enableScroll, getSourceImage } from "./clamp"

type ZoomedImgStatus = "idle" | "loading" | "loaded" | "error"

export type ZoomImageHoverOptions = {
    customZoom: { width: number; height: number }
    zoomImageSource?: string
    zoomLensClass?: string
    zoomLensScale?: number
    zoomTarget: HTMLElement
    zoomTargetClass?: string
    scale?: number
    disableScrollLock?: boolean
    zoomImageProps?: {
        alt?: string
        className?: string
    }
}

export type ZoomImageHoverState = {
    zoomedImgStatus: ZoomedImgStatus
    enabled: boolean
}

export type ZoomImageHoverStateUpdate = { enabled: boolean }

function positiveNumberOr(value: number | undefined, fallback: number) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallback
}

export function createZoomImageHover(container: HTMLElement, options: ZoomImageHoverOptions) {
    const controller = new AbortController()
    const { signal } = controller
    const sourceImgElement = getSourceImage(container)
    const zoomedImgWrapper = document.createElement("div")
    zoomedImgWrapper.style.overflow = "hidden"

    const zoomedImg = zoomedImgWrapper.appendChild(document.createElement("img"))
    zoomedImg.alt = options.zoomImageProps?.alt ?? ""
    zoomedImg.className = options.zoomImageProps?.className ?? ""
    zoomedImg.draggable = false
    zoomedImg.style.maxWidth = "none"
    zoomedImg.style.display = "none"
    zoomedImg.style.pointerEvents = "none"

    const zoomLens = container.appendChild(document.createElement("div"))
    zoomLens.style.display = "none"
    zoomLens.style.pointerEvents = "none"

    let sourceImageElementWidth = 0
    let sourceImageElementHeight = 0
    let disposed = false
    let scrollLocked = false

    const finalOptions: Omit<Required<ZoomImageHoverOptions>, "zoomImageProps"> = {
        zoomImageSource: options.zoomImageSource ?? sourceImgElement.src,
        zoomLensClass: options.zoomLensClass ?? "",
        zoomTargetClass: options.zoomTargetClass ?? "",
        customZoom: options.customZoom,
        scale: positiveNumberOr(options.scale, 2),
        zoomTarget: options.zoomTarget,
        zoomLensScale: positiveNumberOr(options.zoomLensScale, 1),
        disableScrollLock: options.disableScrollLock ?? false,
    }

    const {
        scale,
        zoomImageSource,
        customZoom,
        zoomLensClass,
        zoomTarget,
        zoomLensScale,
        zoomTargetClass,
        disableScrollLock,
    } = finalOptions

    const store = createStore<ZoomImageHoverState>({
        zoomedImgStatus: "idle",
        enabled: true,
    })

    let offset = getOffset(sourceImgElement)
    const originalTargetPointerEvents = zoomTarget.style.pointerEvents
    const targetClassNames = zoomTargetClass.split(/\s+/).filter(Boolean)
    const targetClassesAddedByZoom = new Set<string>()

    function getOffset(element: HTMLElement) {
        const elRect = element.getBoundingClientRect()
        return { left: elRect.left, top: elRect.top }
    }

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

    function addTargetClasses() {
        for (const className of targetClassNames) {
            if (!zoomTarget.classList.contains(className)) {
                zoomTarget.classList.add(className)
                targetClassesAddedByZoom.add(className)
            }
        }
    }

    function removeTargetClasses() {
        for (const className of targetClassesAddedByZoom) {
            zoomTarget.classList.remove(className)
        }
        targetClassesAddedByZoom.clear()
    }

    function getLimitX(value: number) {
        return sourceImageElementWidth - value
    }

    function getLimitY(value: number) {
        return sourceImageElementHeight - value
    }

    function zoomLensLeft(left: number) {
        const minX = zoomLens.clientWidth / 2
        return clamp(left, minX, getLimitX(minX)) - minX
    }

    function zoomLensTop(top: number) {
        const minY = zoomLens.clientHeight / 2
        return clamp(top, minY, getLimitY(minY)) - minY
    }

    function processZoom(event: PointerEvent) {
        if (!sourceImageElementWidth || !sourceImageElementHeight) return

        const offsetX = zoomLensLeft(event.clientX - offset.left)
        const offsetY = zoomLensTop(event.clientY - offset.top)
        const backgroundX = (offsetX * scale) / zoomLensScale
        const backgroundY = (offsetY * scale) / zoomLensScale

        zoomedImg.style.transform = `translate(${-backgroundX}px, ${-backgroundY}px)`
        zoomLens.style.transform = `translate(${offsetX}px, ${offsetY}px)`
    }

    function handlePointerEnter() {
        imageLoader.createZoomImage(zoomedImg, zoomImageSource, store)
        zoomedImg.style.display = "block"
        zoomLens.style.display = "block"
        addTargetClasses()
        lockPageScroll()
    }

    function handlePointerLeave() {
        zoomedImg.style.display = "none"
        zoomLens.style.display = "none"
        removeTargetClasses()
        unlockPageScroll()
    }

    function updateOffset() {
        offset = getOffset(sourceImgElement)
    }

    function updateGeometry() {
        if (disposed) return

        const containerRect = container.getBoundingClientRect()
        sourceImageElementWidth = containerRect.width
        sourceImageElementHeight = containerRect.height
        updateOffset()

        const sourceImageRect = sourceImgElement.getBoundingClientRect()
        const fromLeft = sourceImageRect.left - containerRect.left
        const fromTop = sourceImageRect.top - containerRect.top

        zoomLens.style.left = `${fromLeft}px`
        zoomLens.style.top = `${fromTop}px`
        zoomLens.style.width = `${(customZoom.width / scale) * zoomLensScale}px`
        zoomLens.style.height = `${(customZoom.height / scale) * zoomLensScale}px`
        zoomedImg.width = (sourceImageElementWidth * scale) / zoomLensScale
        zoomedImg.height = (sourceImageElementHeight * scale) / zoomLensScale
    }

    let resizeObserver: ResizeObserver | undefined

    function setup() {
        if (zoomLensClass) {
            zoomLens.className = zoomLensClass
        } else {
            zoomLens.style.backgroundImage = "url(data:image/gif;base64,R0lGODlhZABkAPABAHOf4fj48yH5BAEAAAEALAAAAABkAGQAAAL+jI+py+0PowOB2oqvznz7Dn5iSI7SiabqWrbj68bwTLL2jUv0Lvf8X8sJhzmg0Yc8mojM5kmZjEKPzqp1MZVqs7Cr98rdisOXr7lJHquz57YwDV8j3XRb/C7v1vcovD8PwicY8VcISDGY2GDIKKf4mNAoKQZZeXg5aQk5yRml+dgZ2vOpKGraQpp4uhqYKsgKi+H6iln7N8sXG4u7p2s7ykvnyxos/DuMWtyGfKq8fAwd5nzGHN067VUtiv2lbV3GDfY9DhQu7p1pXoU+rr5ODk/j7sSePk9Ub33PlN+4jx8v4JJ/RQQa3EDwzcGFiBLi6AfN4UOGCyXegGjIoh0fisQ0rsD4y+NHjgZFqgB5y2Qfks1UPmEZ0OVLlIcKAAA7)"
            zoomLens.style.cursor = "inherit"
        }

        container.addEventListener("pointerdown", processZoom, { signal })
        container.addEventListener("pointermove", processZoom, { signal })
        container.addEventListener("pointerenter", handlePointerEnter, { signal })
        container.addEventListener("pointerleave", handlePointerLeave, { signal })
        window.addEventListener("scroll", updateOffset, { signal })
        window.addEventListener("resize", updateGeometry, { signal })

        zoomTarget.appendChild(zoomedImgWrapper)
        zoomedImgWrapper.style.width = `${customZoom.width}px`
        zoomedImgWrapper.style.height = `${customZoom.height}px`
        zoomTarget.style.pointerEvents = "none"
        zoomLens.style.position = "absolute"
        updateGeometry()

        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(updateGeometry)
            resizeObserver.observe(container)
        }
    }

    setup()

    return {
        cleanup: () => {
            disposed = true
            controller.abort()
            resizeObserver?.disconnect()
            unlockPageScroll()
            removeTargetClasses()
            zoomTarget.style.pointerEvents = originalTargetPointerEvents

            container.contains(zoomLens) && container.removeChild(zoomLens)
            zoomTarget.contains(zoomedImgWrapper) && zoomTarget.removeChild(zoomedImgWrapper)
            store.cleanup()
        },
        subscribe: store.subscribe,
        getState: store.getState,
        setState: (newState: ZoomImageHoverStateUpdate) => {
            store.setState(newState)
        },
    }
}
