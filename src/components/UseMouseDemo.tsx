"use client"
import React from 'react'
import { useMouse } from '../hooks';


const UseMouseDemo = () => {
    const { ref, x, y } = useMouse({ resetOnExit: true });
    return (
        <>
            <p>Note: Don't use this hook as of 1.1.0 as it re-renders whole component on mouse position
                change. It will be optimized on future versions to ensure debouncing and better performance.
            </p>
            <div style={{ height: "300px", width: "300px", border: "2px solid black" }} ref={ref}>

            </div>
            <p>
                Mouse coordinates {`{ x: ${x}, y: ${y} }`}

            </p>

        </>


    );

}

export default UseMouseDemo;
