import { point } from './point';

export type shape =
    | {
          type: 'polygon';
          points: point[];
          color: string;
          handDrawn: boolean;
          lineWidth: number;
          strokeStyle: stroke;
      }
    | {
          type: 'ellipse';
          center: point;
          radius: point;
          color: string;
          lineWidth: number;
          strokeStyle: stroke;
      };

export type stroke = 'solid' | 'dashed' | 'dotted';
