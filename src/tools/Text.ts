import { MouseArguments, tool } from '../types/tool';

export const Text: tool = {
    name: 'text',
    mouseDown,
    mouseMove,
    mouseUp,
};

function mouseDown(args: MouseArguments) {}

function mouseMove(args: MouseArguments) {}

function mouseUp(args: MouseArguments) {}
