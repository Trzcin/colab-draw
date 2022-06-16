import { point } from './point';

export type shape =
    | {
          id: string;
          type: 'polygon';
          points: point[];
          color: string;
          handDrawn: boolean;
          lineWidth: number;
          strokeStyle: stroke;
          remote?: boolean;
      }
    | {
          id: string;
          type: 'ellipse';
          center: point;
          radius: point;
          color: string;
          lineWidth: number;
          strokeStyle: stroke;
          remote?: boolean;
      };

export type stroke = 'solid' | 'dashed' | 'dotted';
