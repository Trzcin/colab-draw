import { useEffect, useRef, useState } from 'react';
import { SelectBox } from './SelectBox';
import { Toolbar } from './Toolbar';
import { Draw } from './tools/Tools';
import { c_mode } from './types/cursorMode';
import { point } from './types/point';
import { shape, stroke } from './types/shape';
import { tool } from './types/tool';
import { render } from './utils/render';
import { zoom } from './utils/zoom';

const CANVAS_COLOR = '#eee';

interface props {
    shapes: shape[];
    setShapes: React.Dispatch<React.SetStateAction<shape[]>>;
    sendShape: (shape: shape) => void;
    updateShape: (shape: shape) => void;
}

export function Canvas({ setShapes, shapes, sendShape, updateShape }: props) {
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
    const [isUsingPolygon, setIsUsingPolygon] = useState<boolean>(false);
    const [lineWidth, setLineWidth] = useState(6);
    const [strokeStyle, setStrokeStyle] = useState<stroke>('solid');
    const [hideDropdowns, setHideDropdowns] = useState(false);
    const [selectedShape, setSelectedShape] = useState<shape>();
    const [cursorMode, setCursorMode] = useState<c_mode>('select');
    const [clickSelectShape, setClickSelectShape] = useState<shape>();

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

        window.onmousemove = (e) => {
            setMousePosRaw({
                x: e.pageX,
                y: e.pageY,
            });
        };

        document.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget) {
                console.log('adios');
                //@ts-ignore
                handleMouseUp(e);
            }
        });

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
        e: React.MouseEvent<
            HTMLCanvasElement | HTMLButtonElement | HTMLDivElement,
            MouseEvent
        >,
        overwriteCursorMode?: c_mode
    ) {
        if (e.button != 0 || !ctx) {
            return;
        }
        const transform = ctx.getTransform();

        setClickMousePosRaw({ ...mousePosRaw });
        setIsMouseDown(true);
        setClickCanvasOrigin({ x: transform.e, y: transform.f });
        setHideDropdowns(true);
        if (selectedShape) setClickSelectShape({ ...selectedShape });

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
            sendShape,
            setSelectedShape,
            shapes,
            cursorMode: overwriteCursorMode ? overwriteCursorMode : cursorMode,
            clickSelectShape,
            selectedShape,
            updateShape,
        });

        render(ctx, shapes, CANVAS_COLOR);
    }

    function handleMouseMove(
        e: React.MouseEvent<
            HTMLCanvasElement | HTMLButtonElement | HTMLDivElement,
            MouseEvent
        >
    ) {
        if (!ctx) return;

        const transform = ctx.getTransform();

        setMousePos({
            x: (e.pageX - transform.e) / transform.a,
            y: (e.pageY - transform.f) / transform.a,
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
            sendShape,
            setSelectedShape,
            shapes,
            cursorMode,
            clickSelectShape,
            selectedShape,
            updateShape,
        });

        render(ctx, shapes, CANVAS_COLOR);
    }

    function handleMouseUp(
        e: React.MouseEvent<
            HTMLCanvasElement | HTMLButtonElement | HTMLDivElement,
            MouseEvent
        >
    ) {
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
            sendShape,
            setSelectedShape,
            shapes,
            cursorMode,
            clickSelectShape,
            selectedShape,
            updateShape,
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
            const validShapes = prev.filter((s) => !s.remote);
            const lastShape = validShapes[validShapes.length - 1];
            if (lastShape.type != 'polygon') {
                return prev;
            }

            lastShape.points.pop();
            sendShape(lastShape);
            return prev;
        });
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
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
            <SelectBox
                selectedShape={selectedShape}
                ctx={ctx}
                currTool={currTool}
                setCursorMode={setCursorMode}
                mousePosRaw={mousePosRaw}
                setSelectedShape={setSelectedShape}
                shapes={shapes}
                isMouseDown={isMouseDown}
                cursorMode={cursorMode}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseUp={handleMouseUp}
            ></SelectBox>
        </>
    );
}
