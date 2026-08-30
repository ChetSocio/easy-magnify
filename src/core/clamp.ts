export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
}

export function noop() { }

function preventDefault(event: Event) {
    event.preventDefault()
}

const keySet = new Set(["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"])
function preventDefaultForScrollKeys(event: KeyboardEvent) {
    if (keySet.has(event.key)) {
        preventDefault(event)
        return false
    }
}

let scrollController: AbortController | undefined
let scrollLockCount = 0

/**
 * Prevent page scrolling. Calls are reference counted so multiple zoom instances
 * can safely hold a scroll lock at the same time.
 */
export function disableScroll() {
    scrollLockCount += 1
    if (scrollController) return

    scrollController = new AbortController()
    const { signal } = scrollController
    window.addEventListener("DOMMouseScroll", preventDefault, { signal })
    window.addEventListener("wheel", preventDefault, { passive: false, signal })
    window.addEventListener("touchmove", preventDefault, { passive: false, signal })
    window.addEventListener("keydown", preventDefaultForScrollKeys, { signal })
}

/** Release one page-scroll lock previously acquired with disableScroll. */
export function enableScroll() {
    if (scrollLockCount > 0) scrollLockCount -= 1
    if (scrollLockCount > 0) return

    scrollController?.abort()
    scrollController = undefined
}

export function getSourceImage(container: HTMLElement) {
    if (!container) {
        throw new Error("Please specify a container for the zoom image")
    }

    const sourceImgElement = container.querySelector("img")
    if (!sourceImgElement) {
        throw new Error("Please place an image inside the container")
    }

    return sourceImgElement
}

export type PointerPosition = {
    x: number
    y: number
}

export function getPointersCenter(first: PointerPosition, second: PointerPosition) {
    return {
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
    }
}

export function computeZoomGesture(prev: [PointerPosition, PointerPosition], curr: [PointerPosition, PointerPosition]) {
    const prevCenter = getPointersCenter(prev[0], prev[1])
    const currCenter = getPointersCenter(curr[0], curr[1])
    const centerDist = { x: currCenter.x - prevCenter.x, y: currCenter.y - prevCenter.y }

    const prevDistance = Math.hypot(prev[0].x - prev[1].x, prev[0].y - prev[1].y)
    const currDistance = Math.hypot(curr[0].x - curr[1].x, curr[0].y - curr[1].y)
    let scale = currDistance / prevDistance

    const eps = 0.00001
    if (Math.abs(scale - 1) < eps) {
        scale = 1 + eps
    }

    return {
        scale,
        center: {
            x: prevCenter.x + centerDist.x / (1 - scale),
            y: prevCenter.y + centerDist.y / (1 - scale),
        },
    }
}

export function makeMaybeCallFunction<T>(predicateFn: () => boolean, fn: (arg: T) => void) {
    return (arg: T) => {
        if (predicateFn()) {
            fn(arg)
        }
    }
}

export const scaleLinear =
    ({ domainStart, domainStop, rangeStart, rangeStop }: {
        domainStart: number
        domainStop: number
        rangeStart: number
        rangeStop: number
    }) =>
        (value: number) =>
            rangeStart + (rangeStop - rangeStart) * ((value - domainStart) / (domainStop - domainStart))
