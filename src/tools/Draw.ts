import { MouseArguments, tool } from '../types/tool';
import { simplifyCurve } from '../utils/smoothCurve';

export const Draw: tool = {
    name: 'draw',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {
    args.setShapes((prev) => [
        ...prev,
        {
            id: '',
            type: 'polygon',
            color: args.currColor,
            points: [{ ...args.mousePos }],
            handDrawn: false,
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
        if (lastShape.type != 'polygon') {
            return prev;
        }

        lastShape.points.push({ ...args.mousePos });
        return prev;
    });
}

function mouseUp(args: MouseArguments) {
    if (args.shapesLength > 0 && args.isMouseDown) {
        args.setShapes((prev) => {
            const validShapes = prev.filter((s) => !s.remote);
            const lastShape = validShapes[validShapes.length - 1];
            if (lastShape.type != 'polygon') {
                return prev;
            }

            lastShape.points = simplifyCurve(lastShape.points);
            lastShape.handDrawn = true;
            args.sendShape(lastShape);
            return prev;
        });
    }
}
