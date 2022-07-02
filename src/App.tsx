import { Canvas } from './Canvas';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { shape } from './types/shape';
import updateURLParameter from './utils/updateURLParameter';

function App() {
    const [socket, setSocket] = useState<Socket>();
    const [shapes, setShapes] = useState<shape[]>([]);

    useEffect(() => {
        const tempSocket = io();
        setSocket(tempSocket);

        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        tempSocket.emit('join', !id ? '' : id);

        tempSocket.on('joined', (shapes: shape[], users, s_id) => {
            if (s_id != id) {
                window.history.replaceState(
                    '',
                    '',
                    updateURLParameter(window.location.href, 'id', s_id)
                );
            }

            console.log(shapes, users, s_id);
            const newShapes = [...shapes];
            newShapes.forEach((s) => (s.remote = true));
            setShapes(newShapes);
        });

        tempSocket.on('invalid-id', () => {
            console.error('invalid room id');
        });

        tempSocket.on('add-shape', (shape: shape) => {
            console.log('adding shape');
            setShapes((prev) => [...prev, { ...shape, remote: true }]);
        });

        tempSocket.on('set-shape-id', (id: string) => {
            setShapes((prev) => {
                const pendingShape = prev.find((s) => s.id == '');
                if (pendingShape) {
                    pendingShape.id = id;
                } else {
                    console.error('no pending shape');
                }
                return prev;
            });
        });

        tempSocket.on('update-shape', (shape: shape) => {
            console.log('updating shape');
            setShapes((prev) =>
                prev.map((s) =>
                    s.id == shape.id ? { ...shape, remote: true } : s
                )
            );
        });

        tempSocket.on('delete-shape', (id: string) => {
            console.log('deleting shape');
            setShapes((prev) => prev.filter((s) => s.id != id));
        });

        return () => {
            tempSocket.disconnect();
        };
    }, []);

    function sendShape(shape: shape) {
        if (!socket) return;
        console.log('sending shape');
        socket.emit('create', shape);
    }

    function updateShape(shape: shape) {
        if (!socket) return;
        console.log('updating shape');
        socket.emit('change', shape);
    }

    return (
        <Canvas
            shapes={shapes}
            setShapes={setShapes}
            sendShape={sendShape}
            updateShape={updateShape}
        ></Canvas>
    );
}

export default App;
