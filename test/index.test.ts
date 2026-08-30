import { createZoomImageMove } from "../src/core/createZoomImageMove"
import { createZoomImageHover } from "../src/core/createZoomImageHover"
import cropImage from "../src/core/cropImage"

class FakeClassList {
    private readonly values = new Set<string>()
    add(value: string) { this.values.add(value) }
    remove(value: string) { this.values.delete(value) }
    contains(value: string) { return this.values.has(value) }
}

class FakeEventTarget {
    private readonly listeners = new Map<string, Set<EventListener>>()

    addEventListener(type: string, listener: EventListener, options?: AddEventListenerOptions | boolean) {
        const set = this.listeners.get(type) ?? new Set<EventListener>()
        set.add(listener)
        this.listeners.set(type, set)

        if (typeof options === "object" && options.signal) {
            options.signal.addEventListener("abort", () => set.delete(listener), { once: true })
        }
    }

    dispatch(type: string, event: Partial<PointerEvent> = {}) {
        for (const listener of this.listeners.get(type) ?? []) {
            listener({ preventDefault: jest.fn(), ...event } as unknown as Event)
        }
    }

    listenerCount(type: string) {
        return this.listeners.get(type)?.size ?? 0
    }
}

class FakeElement extends FakeEventTarget {
    readonly style: Record<string, any> = { cssText: "" }
    readonly classList = new FakeClassList()
    readonly children: FakeElement[] = []
    parentElement: FakeElement | null = null
    className = ""
    alt = ""
    src = ""
    draggable = true
    width = 0
    height = 0
    naturalWidth = 0
    naturalHeight = 0
    clientWidth = 0
    clientHeight = 0
    onload: (() => void) | null = null
    onerror: (() => void) | null = null

    constructor(readonly tagName: string) {
        super()
    }

    appendChild<T extends FakeElement>(child: T): T {
        child.parentElement = this
        this.children.push(child)
        return child
    }

    removeChild(child: FakeElement) {
        const index = this.children.indexOf(child)
        if (index >= 0) this.children.splice(index, 1)
        child.parentElement = null
        return child
    }

    contains(child: FakeElement) {
        return this.children.includes(child)
    }

    querySelector(selector: string) {
        if (selector !== "img") return null
        return this.children.find((child) => child.tagName === "img") ?? null
    }

    getBoundingClientRect() {
        return {
            left: 0,
            top: 0,
            right: this.clientWidth,
            bottom: this.clientHeight,
            width: this.clientWidth,
            height: this.clientHeight,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        }
    }
}

class FakeCanvasContext {
    readonly drawImage = jest.fn()
    readonly translate = jest.fn()
    readonly rotate = jest.fn()
}

class FakeCanvas extends FakeElement {
    readonly context = new FakeCanvasContext()
    constructor() { super("canvas") }
    getContext(type: string) { return type === "2d" ? this.context : null }
    toDataURL() { return "data:image/png;base64,test" }
}

const fakeWindow = new FakeEventTarget()
const canvases: FakeCanvas[] = []

function createFakeElement(tagName: string) {
    if (tagName === "canvas") {
        const canvas = new FakeCanvas()
        canvases.push(canvas)
        return canvas
    }
    return new FakeElement(tagName)
}

function createZoomContainer(width = 200, height = 100) {
    const container = new FakeElement("div")
    container.clientWidth = width
    container.clientHeight = height
    const image = new FakeElement("img")
    image.src = "source.jpg"
    image.clientWidth = width
    image.clientHeight = height
    image.naturalWidth = width * 2
    image.naturalHeight = height * 2
    container.appendChild(image)
    return container
}

beforeAll(() => {
    Object.defineProperty(globalThis, "window", { value: fakeWindow, configurable: true })
    Object.defineProperty(globalThis, "document", {
        value: { createElement: createFakeElement },
        configurable: true,
    })
})

beforeEach(() => {
    jest.useFakeTimers()
    canvases.length = 0
})

afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
})

describe("zoom core lifecycle", () => {
    test("scroll locks are reference counted and released during cleanup", () => {
        const first = createZoomContainer()
        const second = createZoomContainer()
        const firstZoom = createZoomImageMove(first as unknown as HTMLElement, {
            zoomImageSource: "",
            disableScrollLock: false,
        })
        const secondZoom = createZoomImageMove(second as unknown as HTMLElement, {
            zoomImageSource: "",
            disableScrollLock: false,
        })

        first.dispatch("pointerenter", { clientX: 20, clientY: 20 })
        second.dispatch("pointerenter", { clientX: 20, clientY: 20 })
        expect(fakeWindow.listenerCount("wheel")).toBe(1)

        firstZoom.cleanup()
        expect(fakeWindow.listenerCount("wheel")).toBe(1)

        secondZoom.cleanup()
        expect(fakeWindow.listenerCount("wheel")).toBe(0)
    })

    test("move zoom applies the configured zoom factor", () => {
        const container = createZoomContainer(200, 100)
        const zoom = createZoomImageMove(container as unknown as HTMLElement, {
            zoomFactor: 2,
            zoomImageSource: "",
            disableScrollLock: true,
        })

        container.dispatch("pointerenter", { clientX: 50, clientY: 25 })
        const zoomedImage = container.children[1]
        expect(zoomedImage.style.width).toBe("400px")
        expect(zoomedImage.style.height).toBe("200px")

        zoom.cleanup()
    })

    test("hover pointer movement replaces transform instead of growing cssText", () => {
        const container = createZoomContainer(200, 100)
        const target = new FakeElement("div")
        const zoom = createZoomImageHover(container as unknown as HTMLElement, {
            customZoom: { width: 100, height: 100 },
            zoomTarget: target as unknown as HTMLElement,
            zoomImageSource: "",
            scale: 2,
            disableScrollLock: true,
        })

        container.dispatch("pointermove", { clientX: 50, clientY: 25 })
        container.dispatch("pointermove", { clientX: 60, clientY: 30 })

        const lens = container.children[1]
        expect(lens.style.cssText).toBe("")
        expect(lens.style.transform).toContain("translate(")

        zoom.cleanup()
    })

    test("hover cleanup restores zoom-target styles", () => {
        const container = createZoomContainer()
        const target = new FakeElement("div")
        target.style.pointerEvents = "auto"
        const zoom = createZoomImageHover(container as unknown as HTMLElement, {
            customZoom: { width: 100, height: 100 },
            zoomTarget: target as unknown as HTMLElement,
            disableScrollLock: true,
        })

        expect(target.style.pointerEvents).toBe("none")
        zoom.cleanup()
        expect(target.style.pointerEvents).toBe("auto")
    })
})

describe("cropImage", () => {
    test("normalizes negative right-angle rotations without decoding an intermediate image", async () => {
        const image = new FakeElement("img")
        image.naturalWidth = 1000
        image.naturalHeight = 800
        image.clientWidth = 500
        image.clientHeight = 400

        const result = await cropImage({
            image: image as unknown as HTMLImageElement,
            currentZoom: 2,
            positionX: -100,
            positionY: -50,
            rotation: -90,
        })

        expect(result).toBe("data:image/png;base64,test")
        expect(canvases).toHaveLength(2)
        expect(canvases[0].width).toBe(500)
        expect(canvases[0].height).toBe(400)
        expect(canvases[1].width).toBe(400)
        expect(canvases[1].height).toBe(500)
    })

    test("rejects invalid zoom values", async () => {
        const image = new FakeElement("img")
        image.naturalWidth = 1000
        image.naturalHeight = 800
        image.clientWidth = 500
        image.clientHeight = 400

        await expect(cropImage({
            image: image as unknown as HTMLImageElement,
            currentZoom: 0,
            positionX: 0,
            positionY: 0,
        })).rejects.toThrow(RangeError)
    })
})
