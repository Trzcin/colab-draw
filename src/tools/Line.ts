import { MouseArguments, tool } from '../types/tool';

export const Line: tool = {
    name: 'line',
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
            points: [{ ...args.mousePos }, { ...args.mousePos }],
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

        lastShape.points[1] = { ...args.mousePos };
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
