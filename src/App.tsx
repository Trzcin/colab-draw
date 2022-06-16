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

        tempSocket.on('update-shape', (id: string, shape: shape) => {
            console.log('updating shape');
            setShapes((prev) =>
                prev.map((s) => (s.id == id ? { ...shape, remote: true } : s))
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

    return (
        <Canvas
            shapes={shapes}
            setShapes={setShapes}
            sendShape={sendShape}
        ></Canvas>
    );
}

export default App;
