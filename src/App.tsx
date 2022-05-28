import { useEffect, useRef, useState } from 'react';
import { point } from './types/point';
import { shape } from './types/shape';
import { tool } from './types/tool';
import { render } from './utils/render';
import { simplifyCurve } from './utils/smoothCurve';

const CANVAS_COLOR = '#eee';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

    const [currTool, setCurrTool] = useState<tool>('draw');
    const [currColor, setCurrColor] = useState<string>('black');
    const [mousePos, setMousePos] = useState<point>({ x: 0, y: 0 });
    const [shapes, setShapes] = useState<shape[]>([]);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("canvas can't be accessed");
            return;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.onresize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.onmousemove = (e) => {
            setMousePos({ x: e.pageX, y: e.pageY });
        };

        const context = canvas.getContext('2d')!;

        setCtx(context);

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 6;
    }, []);

    // render
    useEffect(() => {
        if (ctx == undefined) return;
        render(ctx, shapes, CANVAS_COLOR);
    }, [shapes]);

    function handleMouseDown(
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) {
        if (e.button != 0) {
            return;
        }

        setIsMouseDown(true);
        if (currTool === 'draw') {
            setShapes((prev) => [
                ...prev,
                {
                    color: currColor,
                    points: [{ ...mousePos }],
                    handDrawn: false,
                },
            ]);
        }
    }

    function handleMouseMove() {
        if (currTool === 'draw' && isMouseDown) {
            setShapes((prev) => {
                const newStuff = [...prev];
                newStuff[newStuff.length - 1].points.push({ ...mousePos });
                return newStuff;
            });
        }
    }

    function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (e.button != 0) {
            return;
        }
        setIsMouseDown(false);

        if (currTool == 'draw' && shapes.length > 0) {
            setShapes((prev) => {
                const newStuff = [...prev];
                newStuff[newStuff.length - 1].points = simplifyCurve(
                    newStuff[newStuff.length - 1].points
                );
                newStuff[newStuff.length - 1].handDrawn = true;
                return newStuff;
            });
        }
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseUp}
                style={{ cursor: currTool == 'draw' ? 'crosshair' : 'default' }}
            ></canvas>
        </>
    );
}

export default App;
