<h1>Easy-Magnify</h1>

<p> <code>Easy-magnify </code> is an <strong> open-source image-zooming npm package </strong>. You may have seen really nice image zooming on ecommerce sites like amazon , flipkart and more. If you want same functionality on your site then you can use this </p>

A responsive React image zoom component for touch and mouse.

Designed for shopping site product detail.

Features Include:

* In-place and side-by-side image enlargement
* Positive or negative space guide lens options
* Interaction hint
* Configurable enlarged image dimensions
* Optional enlarged image external render
* Hover intent
* Long-press gesture
* Fade transitions
* Basic react-slick carousel support

## Status

[![npm](https://img.shields.io/npm/v/easy-magnify.svg)](https://www.npmjs.com/package/easy-magnify)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Author: <a href='https://batchnepal.com'>BatchNepal Consultancy & Chetraj Gautam</a> <br>

## Demo & Usage

Docs is coming soon but demo and usage can be seen on storybook live at: .  

## Installation

```sh
npm install easy-magnify
```

## Usage

Usage is pretty simple. Remember: using latest version of this package is always recommended

```JavaScript
import { EasyZoomOnHover } from 'easy-magnify';

<EasyZoomOnHover
        mainImage={{
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX466_.jpg",
            alt: "My Product"
        }}
        zoomedImage={{
            scale: 4,
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX1500_.jpg",
            alt: "My Product Zoom", width: 500, height: 500
        }}
    />
```

```JavaScript
import { EasyZoomOnMove } from 'easy-magnify';

 <EasyZoomOnMove
        image={{
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX466_.jpg",
            alt: "My Product"
        }}
        zoomedImage={{
            src: "https://m.media-amazon.com/images/I/71sgEIlSvfL._AC_SX1500_.jpg",
            alt: "My Product"
        }}
    />
```

## Required Props

| Prop                        | Type   | Default | Description                                                |
|-----------------------------|--------|---------|--------------------------------|
| mainImage                  | Object | N/A     | Small image information. See [Main Image](#small-image) below.|
| zoomedImage                  | Object | N/A     | Large image information. See [Large Image](#large-image) below.|

### Main Image Api for EasyZoomOnHover

```
{
    width?: number;
    height?: number;
    scale?: number
    src: string;
    alt?: string;
}
```

### Main Image Api for EasyZoomOnMove

```
{
    width?: number;
    height?: number;
    src: string;
    alt?: string;
}
```

For more information on responsive images, please try these resources:  
[Responsive Images 101](https://cloudfour.com/thinks/responsive-images-101-definitions/)  
[Responsive Images - The srcset and sizes Attributes](https://bitsofco.de/the-srcset-and-sizes-attributes/)

### Zoomed Image

```
{
    width?: number;
    height?: number;
    scale?: number
    src: string;
    alt?: string;
}
```

## Support

Please [open an issue](https://github.com/ChetSocio/easy-magnify/issues).
If you want dedicated support, please contact us at [batchnepal website](<https://batchnepal.com/contact-us>).
<p>The inspiration was taken from other package that has not been updated since last 3-4 years and many people seem to use it till now even after it conflicts with React 17 & 18.
If you like this package then make sure to give it some stars.</p>

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch,
add commits, and [open a pull request](https://github.com/ChetSocio/easy-magnify/compare/).
