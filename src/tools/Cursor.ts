import { MouseArguments, tool } from '../types/tool';

export const Cursor: tool = {
    name: 'cursor',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {}

function mouseMove(args: MouseArguments) {}

function mouseUp(args: MouseArguments) {}
