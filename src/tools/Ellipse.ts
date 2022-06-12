import { point } from '../types/point';
import { MouseArguments, tool } from '../types/tool';

export const Ellipse: tool = {
    name: 'ellipse',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {
    args.setShapes((prev) => [
        ...prev,
        {
            type: 'ellipse',
            color: args.currColor,
            center: { ...args.mousePos },
            radius: { x: 0, y: 0 },
            lineWidth: args.lineWidth,
            strokeStyle: args.strokeStyle,
        },
    ]);
}

function mouseMove(args: MouseArguments) {
    if (!args.isMouseDown) {
        return;
    }

    args.setShapes((prev) => {
        const newStuff = [...prev];
        const lastShape = newStuff[newStuff.length - 1];
        if (lastShape.type != 'ellipse') {
            return newStuff;
        }

        const clickPos: point = {
            x:
                args.mousePos.x > lastShape.center.x
                    ? lastShape.center.x - lastShape.radius.x
                    : lastShape.center.x + lastShape.radius.x,
            y:
                args.mousePos.y > lastShape.center.y
                    ? lastShape.center.y - lastShape.radius.y
                    : lastShape.center.y + lastShape.radius.y,
        };
        const newCenter: point = {
            x: (clickPos.x + args.mousePos.x) / 2,
            y: (clickPos.y + args.mousePos.y) / 2,
        };
        const newRadius: point = {
            x: Math.abs(newCenter.x - args.mousePos.x),
            y: Math.abs(newCenter.y - args.mousePos.y),
        };

        newStuff[newStuff.length - 1] = {
            type: 'ellipse',
            color: lastShape.color,
            center: newCenter,
            radius: newRadius,
            lineWidth: args.lineWidth,
            strokeStyle: args.strokeStyle,
        };

        return newStuff;
    });
}

function mouseUp(args: MouseArguments) {}
