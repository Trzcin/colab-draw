import { point } from '../types/point';
import { MouseArguments, tool } from '../types/tool';

export const Move: tool = {
    name: 'move',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {}

function mouseMove(args: MouseArguments) {
    if (!args.isMouseDown) {
        return;
    }

    const transform = args.ctx.getTransform();

    const dir: point = {
        x: args.mousePosRaw.x - args.clickMousePosRaw.x,
        y: args.mousePosRaw.y - args.clickMousePosRaw.y,
    };
    const move: point = {
        x: dir.x + args.clickCanvasOrigin.x - transform.e,
        y: dir.y + args.clickCanvasOrigin.y - transform.f,
    };

    args.ctx.translate(move.x, move.y);
}

function mouseUp(args: MouseArguments) {}
