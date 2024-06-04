"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { ZoomImageHoverState, createZoomImageHover as _createZoomImageHover } from "../core/createZoomImageHover"


export default function useZoomImageHover() {
    const result = useRef<ReturnType<typeof _createZoomImageHover>>()
    const [zoomImageState, updateZoomImageState] = useState<ZoomImageHoverState>({
        enabled: false,
        zoomedImgStatus: "idle",
    })

    const createZoomImage = useCallback((...arg: Parameters<typeof _createZoomImageHover>) => {
        result.current?.cleanup()
        result.current = _createZoomImageHover(...arg)
        updateZoomImageState(result.current.getState())

        result.current.subscribe(({ state }: any) => {
            updateZoomImageState(state)
        })
    }, [])

    useEffect(() => {
        return () => {
            result.current?.cleanup()
        }
    }, [])

    return {
        createZoomImage,
        zoomImageState,
        setZoomImageState: result.current?.setState ?? (() => { }),
    }
}