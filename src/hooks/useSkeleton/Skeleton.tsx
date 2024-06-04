import React from "react";
import { HTMLAttributes } from 'react';


export interface SkeletonPropsType extends HTMLAttributes<HTMLDivElement> {
    height: number;
    width: number;

    /**
     * Animation of the skeleton. Default is "pulse 2s ease-in-out 0.5s infinite"
     */
    animation?: string;

    /**
     * Background color of the skeleton. Default is #0000001c
     */
    backgroundColor?: string;
}

const EasySkeleton = (props: SkeletonPropsType) => {

    const { height, width, backgroundColor, animation, ...other } = props;

    return (
        <div className="easyPulseSkeleton" style={{
            backgroundColor: backgroundColor ?? "#0000001c",
            height: `${height}px`,
            width: `${width}px`,
            animation: animation ?? "pulse 2s ease-in-out 0.5s infinite"
        }}
            {...other}
        />
    );
};

export default EasySkeleton;