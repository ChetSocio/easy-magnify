# Easy-Magnify

`easy-magnify` is a React image magnification library for product galleries and other image-heavy interfaces. It provides zoom-on-hover and zoom-on-move components, TypeScript declarations, configurable magnification, and styling hooks.

## Compatibility

- React 17, 18, and 19
- React DOM 17, 18, and 19
- Next.js App Router through a client-component boundary
- TypeScript declarations are included in the package

## Installation

```bash
npm install easy-magnify
```

## Zoom on move

```tsx
import { EasyZoomOnMove } from "easy-magnify"

export function ProductImage() {
  return (
    <EasyZoomOnMove
      delayTimer={0}
      zoomFactor={3}
      mainImage={{
        src: "/product-800.jpg",
        alt: "Product front view",
        width: 480,
        height: 480,
      }}
      zoomImage={{
        src: "/product-1600.jpg",
        alt: "Product front view enlarged",
      }}
    />
  )
}
```

`zoomFactor` controls magnification. The default is `4` for `EasyZoomOnMove`.

Page scrolling remains enabled by default while the pointer is over the image. Set `disableScrollLock={false}` only when your application intentionally needs the legacy scroll-lock behavior.

## Zoom on hover

```tsx
import { EasyZoomOnHover } from "easy-magnify"

export function ProductImage() {
  return (
    <EasyZoomOnHover
      delayTimer={0}
      zoomFactor={3}
      lensScale={1}
      zoomContainerWidth={520}
      zoomContainerHeight={520}
      mainImage={{
        src: "/product-800.jpg",
        alt: "Product front view",
        width: 480,
        height: 480,
      }}
      zoomImage={{
        src: "/product-1600.jpg",
        alt: "Product front view enlarged",
      }}
    />
  )
}
```

For hover zoom, `zoomFactor` controls image magnification and `lensScale` controls the physical lens size. The existing `zoomLensScale` prop remains available as a deprecated alias for the historical magnification behavior so existing applications are not silently broken.

## Styling

Both public components accept normal root styling hooks:

```tsx
<EasyZoomOnHover
  className="product-magnifier"
  style={{ cursor: "crosshair" }}
  imageClassName="product-magnifier__image"
  zoomContainerClassName="product-magnifier__zoom"
  zoomLensClassName="product-magnifier__lens"
  zoomImageClassName="product-magnifier__zoom-image"
  mainImage={{ src: "/product.jpg", alt: "Product" }}
  zoomImage={{ src: "/product-large.jpg", alt: "Product enlarged" }}
/>
```

`EasyZoomOnMove` additionally supports `imageClassName`, `imageStyle`, and `zoomImageClassName`. Inline styles are merged after the library defaults so application styles can override the default cursor and layout where needed.

## Next.js 13+

Keep the magnifier behind a client-component boundary. A separate `dynamic(..., { ssr: false })` wrapper is not required for the normal App Router pattern.

```tsx
// app/components/ProductZoom.tsx
"use client"

import { EasyZoomOnHover } from "easy-magnify"

export function ProductZoom() {
  return (
    <EasyZoomOnHover
      delayTimer={0}
      mainImage={{ src: "/product.jpg", alt: "Product" }}
      zoomImage={{ src: "/product-large.jpg", alt: "Product enlarged" }}
    />
  )
}
```

The client component can then be imported by an App Router page or another server component:

```tsx
import { ProductZoom } from "./components/ProductZoom"

export default function Page() {
  return <ProductZoom />
}
```

## Main props

### `EasyZoomOnMove`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mainImage` | object | required | Source image and optional rendered dimensions. |
| `zoomImage` | object | required | High-resolution zoom image. |
| `zoomFactor` | number | `4` | Magnification factor. |
| `disableScrollLock` | boolean | `true` | Keep page scrolling enabled while magnifying. |
| `delayTimer` | number | `1600` | Delay before revealing the loaded source image. Use `0` for immediate display. |
| `className` / `style` | React styling props | — | Customize the source-image container. |

### `EasyZoomOnHover`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mainImage` | object | required | Source image and optional rendered dimensions. |
| `zoomImage` | object | required | High-resolution zoom image. |
| `zoomFactor` | number | `3` | Magnification factor. |
| `lensScale` | number | `1` | Physical hover-lens scale. |
| `zoomContainerWidth` | number | source width | Zoom viewport width. |
| `zoomContainerHeight` | number | source height | Zoom viewport height. |
| `distance` | number | `10` | Gap between source and zoom viewport. |
| `disableScrollLock` | boolean | `true` | Keep page scrolling enabled while magnifying. |
| `className` / `style` | React styling props | — | Customize the source-image container. |

## Development

```bash
npm run typecheck
npm test
npm run build
```

The regression suite covers scroll-lock lifecycle behavior, configurable move zoom, hover pointer-transform stability, and crop/rotation edge cases.

## Support

Please open an issue at the GitHub repository for reproducible bugs or feature requests.

## License

MIT
