import { c_mode } from './cursorMode';
import { point } from './point';
import { shape, stroke } from './shape';

export type tool = {
    name:
        | 'move'
        | 'cursor'
        | 'draw'
        | 'line'
        | 'rect'
        | 'ellipse'
        | 'polygon'
        | 'text';
    mouseDown: (args: MouseArguments) => void;
    mouseMove: (args: MouseArguments) => void;
    mouseUp: (args: MouseArguments) => void;
};

export type MouseArguments = {
    ctx: CanvasRenderingContext2D;
    setShapes: React.Dispatch<React.SetStateAction<shape[]>>;
    mousePos: point;
    isMouseDown: boolean;
    currColor: string;
    isUsingPolygon: boolean;
    mousePosRaw: point;
    clickMousePosRaw: point;
    clickCanvasOrigin: point;
    shapesLength: number;
    setIsUsingPolygon: React.Dispatch<React.SetStateAction<boolean>>;
    lineWidth: number;
    strokeStyle: stroke;
    sendShape: (shape: shape) => void;
    setSelectedShape: React.Dispatch<React.SetStateAction<shape | undefined>>;
    shapes: shape[];
    cursorMode: c_mode;
    clickSelectShape: shape | undefined;
    selectedShape: shape | undefined;
    updateShape: (shape: shape) => void;
    setEditText: React.Dispatch<React.SetStateAction<shape | undefined>>;
    editText: shape | undefined;
};
