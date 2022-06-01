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
    const [clickMousePosRaw, setClickMousePosRaw] = useState<point>({
        x: 0,
        y: 0,
    });
    const [clickCanvasOrigin, setClickCanvasOrigin] = useState<point>({
        x: 0,
        y: 0,
    });

    const [currTool, setCurrTool] = useState<tool>('polygon');
    const [currColor, setCurrColor] = useState<string>('black');
    const [shapes, setShapes] = useState<shape[]>([]);
    const [isUsingPolygon, setIsUsingPolygon] = useState<boolean>(false);

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

        setClickMousePosRaw({ ...mousePosRaw });
        setIsMouseDown(true);
        setClickCanvasOrigin({ x: transform.e, y: transform.f });

        switch (currTool) {
            case 'draw':
                setShapes((prev) => [
                    ...prev,
                    {
                        type: 'polygon',
                        color: currColor,
                        points: [{ ...mousePos }],
                        handDrawn: false,
                    },
                ]);
                break;
            case 'line':
                setShapes((prev) => [
                    ...prev,
                    {
                        type: 'polygon',
                        color: currColor,
                        points: [{ ...mousePos }, { ...mousePos }],
                        handDrawn: false,
                    },
                ]);
                break;
            case 'rect':
                setShapes((prev) => [
                    ...prev,
                    {
                        type: 'polygon',
                        color: currColor,
                        points: [
                            { ...mousePos },
                            { ...mousePos },
                            { ...mousePos },
                            { ...mousePos },
                            { ...mousePos },
                        ],
                        handDrawn: false,
                    },
                ]);
                break;
            case 'ellipse':
                setShapes((prev) => [
                    ...prev,
                    {
                        type: 'ellipse',
                        color: currColor,
                        center: { ...mousePos },
                        radius: { x: 0, y: 0 },
                    },
                ]);
                break;
            case 'polygon':
                if (!isUsingPolygon) {
                    setShapes((prev) => [
                        ...prev,
                        {
                            type: 'polygon',
                            color: currColor,
                            points: [{ ...mousePos }, { ...mousePos }],
                            handDrawn: false,
                        },
                    ]);
                    setIsUsingPolygon(true);
                } else {
                    setShapes((prev) => {
                        const newStuff = [...prev];
                        const lastShape = newStuff[newStuff.length - 1];
                        if (lastShape.type != 'polygon') {
                            return newStuff;
                        }

                        lastShape.points.push({ ...mousePos });
                        return newStuff;
                    });
                }
            default:
                break;
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

        if (currTool == 'polygon' && isUsingPolygon) {
            setShapes((prev) => {
                const newStuff = [...prev];
                const lastShape = newStuff[newStuff.length - 1];
                if (lastShape.type != 'polygon') {
                    return newStuff;
                }

                lastShape.points[lastShape.points.length - 1] = { ...mousePos };
                return newStuff;
            });
        }

        if (!isMouseDown) {
            return;
        }

        switch (currTool) {
            case 'draw':
                setShapes((prev) => {
                    const newStuff = [...prev];
                    const lastShape = newStuff[newStuff.length - 1];
                    if (lastShape.type != 'polygon') {
                        return newStuff;
                    }

                    lastShape.points.push({ ...mousePos });
                    return newStuff;
                });
                break;
            case 'cursor':
                const dir: point = {
                    x: mousePosRaw.x - clickMousePosRaw.x,
                    y: mousePosRaw.y - clickMousePosRaw.y,
                };
                const move: point = {
                    x: dir.x + clickCanvasOrigin.x - transform.e,
                    y: dir.y + clickCanvasOrigin.y - transform.f,
                };

                ctx.translate(move.x, move.y);

                render(ctx, shapes, CANVAS_COLOR);

                break;
            case 'line':
                setShapes((prev) => {
                    const newStuff = [...prev];
                    const lastShape = newStuff[newStuff.length - 1];
                    if (lastShape.type != 'polygon') {
                        return newStuff;
                    }

                    lastShape.points[1] = { ...mousePos };
                    return newStuff;
                });
                break;
            case 'rect':
                setShapes((prev) => {
                    const newStuff = [...prev];
                    const lastShape = newStuff[newStuff.length - 1];
                    if (lastShape.type != 'polygon') {
                        return newStuff;
                    }

                    const clickPos = lastShape.points[0];
                    lastShape.points = [
                        clickPos,
                        { x: mousePos.x, y: clickPos.y },
                        { ...mousePos },
                        { x: clickPos.x, y: mousePos.y },
                        clickPos,
                    ];
                    return newStuff;
                });
                break;
            case 'ellipse':
                setShapes((prev) => {
                    const newStuff = [...prev];
                    const lastShape = newStuff[newStuff.length - 1];
                    if (lastShape.type != 'ellipse') {
                        return newStuff;
                    }

                    const clickPos: point = {
                        x:
                            mousePos.x > lastShape.center.x
                                ? lastShape.center.x - lastShape.radius.x
                                : lastShape.center.x + lastShape.radius.x,
                        y:
                            mousePos.y > lastShape.center.y
                                ? lastShape.center.y - lastShape.radius.y
                                : lastShape.center.y + lastShape.radius.y,
                    };
                    const newCenter: point = {
                        x: (clickPos.x + mousePos.x) / 2,
                        y: (clickPos.y + mousePos.y) / 2,
                    };
                    const newRadius: point = {
                        x: Math.abs(newCenter.x - mousePos.x),
                        y: Math.abs(newCenter.y - mousePos.y),
                    };

                    newStuff[newStuff.length - 1] = {
                        type: 'ellipse',
                        color: lastShape.color,
                        center: newCenter,
                        radius: newRadius,
                    };

                    return newStuff;
                });
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
                const lastShape = newStuff[newStuff.length - 1];
                if (lastShape.type != 'polygon') {
                    return newStuff;
                }

                lastShape.points = simplifyCurve(lastShape.points);
                lastShape.handDrawn = true;
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
        endPolygon();

        if (currTool == 'draw') setCurrTool('cursor');
        else setCurrTool('draw');

        return false;
    }

    function endPolygon() {
        if (shapes.length == 0) {
            return;
        }

        setIsUsingPolygon(false);
        setShapes((prev) => {
            const newStuff = [...prev];
            const lastShape = newStuff[newStuff.length - 1];
            if (lastShape.type != 'polygon') {
                return newStuff;
            }

            lastShape.points.pop();
            return newStuff;
        });
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
                style={{
                    cursor: currTool == 'cursor' ? 'default' : 'crosshair',
                }}
                onKeyDown={(e) => {
                    if (e.key == 'Escape') endPolygon();
                }}
                tabIndex={-1}
            ></canvas>
        </>
    );
}

export default App;
