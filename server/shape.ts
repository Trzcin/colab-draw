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
          rotation?: number;
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
          rotation?: number;
      }
    | {
          id: string;
          type: 'image';
          center: point;
          scale: point;
          base64: string;
          remote?: boolean;
          rotation?: number;
          size?: point;
      }
    | {
          id: string;
          type: 'text';
          center: point;
          value: string;
          font: string;
          color: string;
          remote?: boolean;
          rotation?: number;
      };

export type stroke = 'solid' | 'dashed' | 'dotted';
