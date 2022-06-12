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
        const newStuff = [...prev];
        const lastShape = newStuff[newStuff.length - 1];
        if (lastShape.type != 'polygon') {
            return newStuff;
        }

        lastShape.points.push({ ...args.mousePos });
        return newStuff;
    });
}

function mouseUp(args: MouseArguments) {
    if (args.shapesLength > 0 && args.isMouseDown) {
        args.setShapes((prev) => {
            const newStuff = [...prev];
            const lastShape = newStuff[newStuff.length - 1];
            if (lastShape.type != 'polygon') {
                return newStuff;
            }

            lastShape.points = simplifyCurve(lastShape.points);
            lastShape.handDrawn = true;
            return newStuff;
        });
    }
}
