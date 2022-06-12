import { useEffect, useRef, useState } from 'react';
import { Toolbar } from './Toolbar';
import { Draw } from './tools/Tools';
import { point } from './types/point';
import { shape, stroke } from './types/shape';
import { tool } from './types/tool';
import { render } from './utils/render';
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

    const [currTool, setCurrTool] = useState<tool>(Draw);
    const [currColor, setCurrColor] = useState<string>('black');
    const [shapes, setShapes] = useState<shape[]>([]);
    const [isUsingPolygon, setIsUsingPolygon] = useState<boolean>(false);
    const [lineWidth, setLineWidth] = useState(6);
    const [strokeStyle, setStrokeStyle] = useState<stroke>('solid');
    const [hideDropdowns, setHideDropdowns] = useState(false);

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
        setHideDropdowns(true);

        currTool.mouseDown({
            ctx,
            clickCanvasOrigin,
            clickMousePosRaw,
            currColor,
            isMouseDown,
            isUsingPolygon,
            mousePos,
            mousePosRaw,
            setIsUsingPolygon,
            setShapes,
            shapesLength: shapes.length,
            lineWidth,
            strokeStyle,
        });

        render(ctx, shapes, CANVAS_COLOR);
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

        currTool.mouseMove({
            ctx,
            clickCanvasOrigin,
            clickMousePosRaw,
            currColor,
            isMouseDown,
            isUsingPolygon,
            mousePos,
            mousePosRaw,
            setIsUsingPolygon,
            setShapes,
            shapesLength: shapes.length,
            lineWidth,
            strokeStyle,
        });

        render(ctx, shapes, CANVAS_COLOR);
    }

    function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (e.button != 0 || !ctx) {
            return;
        }

        currTool.mouseUp({
            ctx,
            clickCanvasOrigin,
            clickMousePosRaw,
            currColor,
            isMouseDown,
            isUsingPolygon,
            mousePos,
            mousePosRaw,
            setIsUsingPolygon,
            setShapes,
            shapesLength: shapes.length,
            lineWidth,
            strokeStyle,
        });

        setIsMouseDown(false);
        setHideDropdowns(false);
        render(ctx, shapes, CANVAS_COLOR);
    }

    function quickToolSwitch(
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ) {
        e.preventDefault();
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
                    cursor:
                        currTool.name == 'move' || currTool.name == 'cursor'
                            ? 'default'
                            : 'crosshair',
                }}
                onKeyDown={(e) => {
                    if (e.key == 'Escape') endPolygon();
                }}
                tabIndex={-1}
            ></canvas>
            <Toolbar
                tool={currTool}
                setTool={setCurrTool}
                setCurrColor={setCurrColor}
                lineWidth={lineWidth}
                setLineWidth={setLineWidth}
                strokeStyle={strokeStyle}
                setStrokeStyle={setStrokeStyle}
                hideDropdowns={hideDropdowns}
            ></Toolbar>
        </>
    );
}

export default App;
