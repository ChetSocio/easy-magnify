export type CropImageArg = {
    currentZoom: number
    image: HTMLImageElement
    positionX: number
    positionY: number
    rotation?: number
}

function assertPositiveFinite(value: number, name: string) {
    if (!Number.isFinite(value) || value <= 0) {
        throw new RangeError(`${name} must be a positive finite number`)
    }
}

function getCanvasContext(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d")
    if (!context) {
        throw new Error("Unable to create a 2D canvas context")
    }
    return context
}

const cropImage = async ({ image, positionX, positionY, currentZoom, rotation = 0 }: CropImageArg) => {
    assertPositiveFinite(currentZoom, "currentZoom")
    assertPositiveFinite(image.naturalWidth, "image.naturalWidth")
    assertPositiveFinite(image.naturalHeight, "image.naturalHeight")
    assertPositiveFinite(image.clientWidth, "image.clientWidth")
    assertPositiveFinite(image.clientHeight, "image.clientHeight")

    const scale = image.naturalWidth / (image.clientWidth * currentZoom)
    const cropWidth = Math.max(1, Math.min(image.naturalWidth, Math.round(image.clientWidth * scale)))
    const cropHeight = Math.max(1, Math.min(image.naturalHeight, Math.round(image.clientHeight * scale)))
    const maxSourceX = Math.max(0, image.naturalWidth - cropWidth)
    const maxSourceY = Math.max(0, image.naturalHeight - cropHeight)
    const sourceX = Math.min(maxSourceX, Math.max(0, -positionX * scale))
    const sourceY = Math.min(maxSourceY, Math.max(0, -positionY * scale))

    const cropCanvas = document.createElement("canvas")
    cropCanvas.width = cropWidth
    cropCanvas.height = cropHeight
    const cropContext = getCanvasContext(cropCanvas)
    cropContext.drawImage(
        image,
        sourceX,
        sourceY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
    )

    const normalizedRotation = ((rotation % 360) + 360) % 360
    if (normalizedRotation === 0) {
        return cropCanvas.toDataURL()
    }

    const radians = (normalizedRotation * Math.PI) / 180
    const rawAbsCos = Math.abs(Math.cos(radians))
    const rawAbsSin = Math.abs(Math.sin(radians))
    const absCos = rawAbsCos < 1e-10 ? 0 : rawAbsCos
    const absSin = rawAbsSin < 1e-10 ? 0 : rawAbsSin
    const rotatedCanvas = document.createElement("canvas")
    rotatedCanvas.width = Math.max(1, Math.ceil(cropWidth * absCos + cropHeight * absSin))
    rotatedCanvas.height = Math.max(1, Math.ceil(cropWidth * absSin + cropHeight * absCos))

    const rotatedContext = getCanvasContext(rotatedCanvas)
    rotatedContext.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2)
    rotatedContext.rotate(radians)
    rotatedContext.drawImage(cropCanvas, -cropWidth / 2, -cropHeight / 2)

    return rotatedCanvas.toDataURL()
}

export default cropImage
