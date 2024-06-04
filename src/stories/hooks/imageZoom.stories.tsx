
import { StoryFn, Meta } from "@storybook/react";
import * as React from "react";
import { EasyZoomOnMove } from "../../index";


export default {
    title: "Components/ZoomOnMove",
    component: EasyZoomOnMove,
    args: {

    }

} as Meta<typeof EasyZoomOnMove>;


const Template: StoryFn<typeof EasyZoomOnMove> = (args) => <div >
    <div>


        <EasyZoomOnMove mainImage={{
            src: "https://m.media-amazon.com/images/I/61vThyaOrHL._AC_SX466_.jpg",
            alt: "My Product",
            width: 466,
            height: 466
        }}
            zoomImage={{
                src: "https://m.media-amazon.com/images/I/61vThyaOrHL._AC_SX1500_.jpg",
                alt: "My Product",
            }}

        />

    </div>

    <div>
        <div style={{ marginTop: "30px" }}>
            <h2 className="componentApi">Component Api: </h2>
            <table style={{ textAlign: "center" }}>
                <thead >
                    <tr >
                        <th style={{ width: "200px", border: '1px solid gray', padding: '6px' }}>Prop</th>
                        <th style={{ width: "200px", border: '1px solid gray' }}>Type</th>
                        <th style={{ width: "200px", border: '1px solid gray' }}>Default</th>
                        <th style={{ maxWidth: "400px", border: '1px solid gray' }}>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td style={{ border: "1px solid gray", padding: "4px" }}>mainImage</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>
                            <pre style={{ backgroundColor: "#f1f5f9", textAlign: "start" }}>
                                {
                                    `   
    mainImage: {
        width?: number;
        height?: number;
        src: string;
        alt?: string;
    }
                            `
                                }
                            </pre>
                        </td>
                        <td style={{ border: "1px solid gray" }}>
                            <pre style={{ backgroundColor: "#f1f5f9", textAlign: "start" }}>
                                {
                                    `   
        width: 500px;
        height?: 500px;
                            `
                                }
                            </pre>

                        </td>
                        <td style={{ border: "1px solid gray" }}>Main image that is displayed normally.</td>
                    </tr>
                    <tr >
                        <td style={{ border: "1px solid gray", padding: "4px" }}>zoomImage</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>
                            <pre style={{ backgroundColor: "#f1f5f9", textAlign: "start" }}>
                                {
                                    `   
        zoomImage: {
            src: string;
            alt?: string;
        }
                            `
                                }
                            </pre>
                        </td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>
                            <pre style={{ backgroundColor: "#f1f5f9", textAlign: "start" }}>
                                {
                                    `   
    src: zoomImage.src ?? mainImage.src ;  
    alt : zoomImage.alt ?? mainImage.alt;  
                            `
                                }
                            </pre>

                        </td>
                        <td style={{ border: "1px solid gray" }}>Zoom Image that appears when user hovers on main image.</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>loadingIndicator</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>React.ReactNode</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}> <pre
                            style={{ backgroundColor: "#f1f5f9", padding: "8px" }}>{"<EasySkeleton />"}</pre> </td>
                        <td style={{ border: "1px solid gray" }}>Gives sense of loading and progressing while components renders .</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>distance</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>number</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>10</td>
                        <td style={{ border: "1px solid gray" }}>distance between main image and zoomed Image.</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>delayTimer</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>number</td>
                        <td style={{ border: "1px solid gray", padding: "4px" }}>1600</td>
                        <td style={{ border: "1px solid gray" }}>How long loading indicator is shown</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br />
        <br />
        <br />
    </div>
</div>;

export const ZoomImageOnMove = Template.bind({});