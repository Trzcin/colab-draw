import { useEffect, useRef, useState } from 'react';
import { c_mode } from './types/cursorMode';
import { point } from './types/point';
import { shape } from './types/shape';
import { tool } from './types/tool';
import RotateIcon from './icons/rotate_icon.svg';
import ScaleIcon from './icons/scale_icon.svg';
import { canvasToScreenPoint } from './utils/canvasToScreenPoint';

const BOX_MARGIN = 30;

interface props {
    selectedShape: shape | undefined;
    ctx: CanvasRenderingContext2D | undefined;
    currTool: tool;
    mousePosRaw: point;
    setCursorMode: React.Dispatch<React.SetStateAction<c_mode>>;
    setSelectedShape: React.Dispatch<React.SetStateAction<shape | undefined>>;
    shapes: shape[];
    isMouseDown: boolean;
    cursorMode: c_mode;
    handleMouseDown: (
        e: React.MouseEvent<
            HTMLCanvasElement | HTMLButtonElement | HTMLDivElement,
            MouseEvent
        >,
        overwriteCursorMode?: c_mode
    ) => void;
    handleMouseMove: (
        e: React.MouseEvent<
            HTMLCanvasElement | HTMLButtonElement | HTMLDivElement,
            MouseEvent
        >,
        overwriteCursorMode?: c_mode
    ) => void;
    handleMouseUp: (
        e: React.MouseEvent<
            HTMLCanvasElement | HTMLButtonElement | HTMLDivElement,
            MouseEvent
        >,
        overwriteCursorMode?: c_mode
    ) => void;
    scrolled: boolean;
}

export function SelectBox({
    selectedShape,
    ctx,
    currTool,
    mousePosRaw,
    setCursorMode,
    setSelectedShape,
    shapes,
    isMouseDown,
    cursorMode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    scrolled,
}: props) {
    const [pos, setPos] = useState<point>({ x: 0, y: 0 });
    const [size, setSize] = useState<point>({ x: 0, y: 0 });
    const [scrolledUpd, setScrolledUpd] = useState(true);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        if (currTool.name != 'cursor') {
            setPos({ x: 0, y: 0 });
            setSize({ x: 0, y: 0 });
            setSelectedShape(undefined);
        }
    }, [currTool]);

    useEffect(() => {
        setScrolledUpd(false);
    }, [scrolled]);

    useEffect(() => {
        if (!hovering && !isMouseDown) {
            setCursorMode('select');
        }
    }, [hovering, isMouseDown]);

    useEffect(() => {
        if (!selectedShape || !ctx) return;
        setScrolledUpd(true);
        if (selectedShape.type == 'polygon') {
            let leftTop = { x: Infinity, y: Infinity };
            let rightBottom = { x: 0, y: 0 };

            for (let point of selectedShape.points) {
                leftTop.x = Math.min(leftTop.x, point.x);
                leftTop.y = Math.min(leftTop.y, point.y);
                rightBottom.x = Math.max(rightBottom.x, point.x);
                rightBottom.y = Math.max(rightBottom.y, point.y);
            }

            leftTop = canvasToScreenPoint(ctx, leftTop);
            rightBottom = canvasToScreenPoint(ctx, rightBottom);

            setPos({ x: leftTop.x - BOX_MARGIN, y: leftTop.y - BOX_MARGIN });
            setSize({
                x: rightBottom.x - leftTop.x + 2 * BOX_MARGIN,
                y: rightBottom.y - leftTop.y + 2 * BOX_MARGIN,
            });
        } else if (selectedShape.type == 'ellipse') {
            let leftTop = {
                x: selectedShape.center.x - selectedShape.radius.x,
                y: selectedShape.center.y - selectedShape.radius.y,
            };
            let rightBottom = {
                x: selectedShape.center.x + selectedShape.radius.x,
                y: selectedShape.center.y + selectedShape.radius.y,
            };

            leftTop = canvasToScreenPoint(ctx, leftTop);
            rightBottom = canvasToScreenPoint(ctx, rightBottom);

            setPos({ x: leftTop.x - BOX_MARGIN, y: leftTop.y - BOX_MARGIN });
            setSize({
                x: rightBottom.x - leftTop.x + 2 * BOX_MARGIN,
                y: rightBottom.y - leftTop.y + 2 * BOX_MARGIN,
            });
        } else {
            if (!selectedShape.size) return;
            let leftTop = {
                x: selectedShape.center.x - selectedShape.size.x / 2,
                y: selectedShape.center.y - selectedShape.size.y / 2,
            };
            let rightBottom = {
                x: selectedShape.center.x + selectedShape.size.x / 2,
                y: selectedShape.center.y + selectedShape.size.y / 2,
            };

            leftTop = canvasToScreenPoint(ctx, leftTop);
            rightBottom = canvasToScreenPoint(ctx, rightBottom);

            setPos({ x: leftTop.x - BOX_MARGIN, y: leftTop.y - BOX_MARGIN });
            setSize({
                x: rightBottom.x - leftTop.x + 2 * BOX_MARGIN,
                y: rightBottom.y - leftTop.y + 2 * BOX_MARGIN,
            });
        }
    }, [selectedShape, shapes, scrolledUpd]);

    return selectedShape ? (
        <div
            className={`select-box ${
                cursorMode != 'select' && isMouseDown ? '' : 'select-border'
            }`}
            // className="select-box select-border"
            style={{
                left: pos.x,
                top: pos.y,
                width: size.x,
                height: size.y,
                transform: selectedShape.rotation
                    ? `rotate(${selectedShape.rotation}rad)`
                    : '',
            }}
            onMouseDown={(e) => {
                setCursorMode('move');
                handleMouseDown(e, 'move');
            }}
            onMouseMove={(e) => {
                handleMouseMove(e);
            }}
            onMouseUp={(e) => {
                handleMouseUp(e);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            <button
                className="cursor-btn"
                style={{
                    left: size.x * 0.5 - 21,
                    top: -100,
                    display:
                        cursorMode != 'select' && isMouseDown
                            ? 'none'
                            : 'block',
                }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    setCursorMode('rotate');
                    handleMouseDown(e, 'rotate');
                }}
            >
                <img src={RotateIcon} alt="rotate shape" />
            </button>
            <button
                className="cursor-btn"
                style={{
                    left: size.x - 21,
                    top: size.y - 21,
                    display:
                        (cursorMode != 'select' && isMouseDown) ||
                        selectedShape.type == 'text'
                            ? 'none'
                            : 'block',
                }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    setCursorMode('scale');
                    handleMouseDown(e, 'scale');
                }}
            >
                <img src={ScaleIcon} alt="resize shape" />
            </button>
        </div>
    ) : null;
}
