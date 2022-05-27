import { useEffect, useRef, useState } from 'react';
import { point } from './types/point';
import { shape } from './types/shape';
import { tool } from './types/tool';

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

    useEffect(() => {
        if (ctx == undefined) return;

        // clear canvas
        ctx.fillStyle = CANVAS_COLOR;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        for (let shape of shapes) {
            ctx.strokeStyle = shape.color;
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            ctx.beginPath();
            for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
            }
            ctx.stroke();
        }
    }, [shapes]);

    function handleMouseDown() {
        setIsMouseDown(true);
        if (currTool === 'draw') {
            setShapes((prev) => [
                ...prev,
                { color: currColor, points: [{ ...mousePos }] },
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

    function handleMouseUp() {
        setIsMouseDown(false);
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: currTool == 'draw' ? 'crosshair' : 'default' }}
            ></canvas>
        </>
    );
}

export default App;
