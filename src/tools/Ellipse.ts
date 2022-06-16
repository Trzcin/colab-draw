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
            id: '',
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
        const validShapes = prev.filter((s) => !s.remote);
        const lastShape = validShapes[validShapes.length - 1];
        if (lastShape.type != 'ellipse') {
            return prev;
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

        lastShape.center = newCenter;
        lastShape.radius = newRadius;

        return prev;
    });
}

function mouseUp(args: MouseArguments) {
    if (args.shapesLength > 0 && args.isMouseDown) {
        args.setShapes((prev) => {
            const validShapes = prev.filter((s) => !s.remote);
            const lastShape = validShapes[validShapes.length - 1];
            args.sendShape(lastShape);
            return prev;
        });
    }
}
