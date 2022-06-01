import { point } from './point';

export type shape =
    | {
          type: 'polygon';
          points: point[];
          color: string;
          handDrawn: boolean;
      }
    | { type: 'ellipse'; center: point; radius: point; color: string };
