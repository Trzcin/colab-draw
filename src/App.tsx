import { useEffect, useRef, useState } from 'react';
import { point } from './types/point';
import { shape } from './types/shape';
import { tool } from './types/tool';
import { render } from './utils/render';
import { simplifyCurve } from './utils/smoothCurve';
import { zoom } from './utils/zoom';

const CANVAS_COLOR = '#eee';

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const [mousePos, setMousePos] = useState<point>({ x: 0, y: 0 });
    const [mousePosRaw, setMousePosRaw] = useState<point>({ x: 0, y: 0 });
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
    const [clickMousePos, setClickMousePos] = useState<point>({ x: 0, y: 0 });
    const [clickCanvasOrigin, setClickCanvasOrigin] = useState<point>({
        x: 0,
        y: 0,
    });

    const [currTool, setCurrTool] = useState<tool>('draw');
    const [currColor, setCurrColor] = useState<string>('black');
    const [shapes, setShapes] = useState<shape[]>([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("canvas can't be accessed");
            return;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const context = canvas.getContext('2d')!;

        window.onresize = () => {
            const oldTransform = context.getTransform();

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.lineWidth = 6;
            context.setTransform(oldTransform);

            render(context, shapes, CANVAS_COLOR);
        };

        setCtx(context);

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 6;
    }, []);

    //fix resize because react
    useEffect(() => {
        if (!ctx || !canvasRef.current) return;

        window.onresize = () => {
            const oldTransform = ctx.getTransform();

            canvasRef.current!.width = window.innerWidth;
            canvasRef.current!.height = window.innerHeight;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 6;
            ctx.setTransform(oldTransform);

            render(ctx, shapes, CANVAS_COLOR);
        };
    }, [shapes, ctx]);

    // render
    useEffect(() => {
        if (ctx == undefined) return;
        render(ctx, shapes, CANVAS_COLOR);
    }, [shapes]);

    function handleScroll(e: React.WheelEvent<HTMLCanvasElement>) {
        if (!ctx) return;
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        zoom(factor, ctx, mousePos);
        render(ctx, shapes, CANVAS_COLOR);
    }

    function handleMouseDown(
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) {
        if (e.button != 0 || !ctx) {
            return;
        }

        const transform = ctx.getTransform();

        setClickMousePos({ ...mousePosRaw });
        setIsMouseDown(true);
        setClickCanvasOrigin({ x: transform.e, y: transform.f });
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

    function handleMouseMove(
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) {
        if (!ctx) return;

        const transform = ctx.getTransform();

        setMousePos({
            x: (e.pageX - transform.e) / transform.a,
            y: (e.pageY - transform.f) / transform.a,
        });
        setMousePosRaw({
            x: e.pageX,
            y: e.pageY,
        });

        if (!isMouseDown) {
            return;
        }

        switch (currTool) {
            case 'draw':
                setShapes((prev) => {
                    const newStuff = [...prev];
                    newStuff[newStuff.length - 1].points.push({ ...mousePos });
                    return newStuff;
                });
                break;
            case 'cursor':
                const dir: point = {
                    x: mousePosRaw.x - clickMousePos.x,
                    y: mousePosRaw.y - clickMousePos.y,
                };
                const move: point = {
                    x: dir.x + clickCanvasOrigin.x - transform.e,
                    y: dir.y + clickCanvasOrigin.y - transform.f,
                };

                ctx.translate(move.x, move.y);

                render(ctx, shapes, CANVAS_COLOR);

                break;
            default:
                break;
        }
    }

    function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (e.button != 0) {
            return;
        }

        if (currTool == 'draw' && shapes.length > 0 && isMouseDown) {
            setIsMouseDown(false);
            setShapes((prev) => {
                const newStuff = [...prev];
                newStuff[newStuff.length - 1].points = simplifyCurve(
                    newStuff[newStuff.length - 1].points
                );
                newStuff[newStuff.length - 1].handDrawn = true;
                return newStuff;
            });
        } else {
            setIsMouseDown(false);
        }
    }

    function quickToolSwitch(
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) {
        e.preventDefault();

        if (currTool == 'draw') setCurrTool('cursor');
        else setCurrTool('draw');

        return false;
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseUp}
                onContextMenu={quickToolSwitch}
                onWheel={handleScroll}
                style={{ cursor: currTool == 'draw' ? 'crosshair' : 'default' }}
            ></canvas>
        </>
    );
}

export default App;
