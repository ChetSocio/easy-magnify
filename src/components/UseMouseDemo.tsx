"use client"
import React from 'react'
import { useMouse } from '../hooks';
import { createTheme } from '@mantine/core';

export const theme: any = createTheme({
});


const UseMouseDemo = () => {
    const { ref, x, y } = useMouse({ resetOnExit: true });
    return (
        <>
            <p>Hello</p>
            <div style={{ height: "300px", width: "300px", border: "2px solid black" }} ref={ref}>

            </div>
            <p>
                Mouse coordinates {`{ x: ${x}, y: ${y} }`}

            </p>

        </>


    );

}

export default UseMouseDemo;
