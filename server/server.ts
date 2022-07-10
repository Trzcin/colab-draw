import sharp from 'sharp';
import { Server, Socket } from 'socket.io';
import { shape } from './shape';

const io = new Server();
const boards: { [key: string]: shape[] } = {};

const genRanHex = (size: number) =>
    [...Array(size)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');

io.on('connection', (socket: Socket) => {
    console.log('User connected');
    socket.on('disconnecting', () => {
        const roomId = Array.from(socket.rooms).pop();
        if (roomId) {
            socket.broadcast.to(roomId).emit('user-left');
        }
        console.log('User left');
    });
    ``;

    socket.on('join', (id: string) => {
        if (typeof id !== 'string') {
            return;
        }

        if (id === '') {
            let newId = '';
            while (Object.keys(boards).length < Math.pow(16, 6)) {
                newId = genRanHex(6);
                if (!Object.keys(boards).includes(newId)) {
                    break;
                }
            }

            boards[newId] = [];
            socket.join(newId);
            socket.emit(
                'joined',
                [],
                io.sockets.adapter.rooms.get(newId)?.size,
                newId
            );
            socket.broadcast.to(newId).emit('user-joined');
        } else {
            if (!Object.keys(boards).includes(id)) {
                socket.emit('invalid-id');
            } else {
                socket.join(id);
                socket.emit(
                    'joined',
                    boards[id],
                    io.sockets.adapter.rooms.get(id)?.size,
                    id
                );
            }
        }
    });

    socket.on('create', async (shape: shape) => {
        const roomId = Array.from(socket.rooms).pop();
        if (!roomId || !boards[roomId]) return;
        let newShapeId = '';
        while (true) {
            newShapeId = genRanHex(10);
            if (!boards[roomId].find((s) => s.id == newShapeId)) {
                break;
            }
        }
        shape.id = newShapeId;
        if (shape.type == 'image') {
            const buffer = Buffer.from(shape.base64, 'base64');
            try {
                const compressedBuffer = await sharp(buffer)
                    .webp({ quality: 10 })
                    .resize(500, 500, { fit: 'inside' })
                    .toBuffer();
                shape.base64 = compressedBuffer.toString('base64');
            } catch (error) {
                console.log(error);
            }

            socket.emit('set-img-data', shape.base64);
        }
        boards[roomId].push(shape);

        socket.broadcast.to(roomId).emit('add-shape', shape);
        socket.emit('set-shape-id', newShapeId);
    });

    socket.on('change', (shape: shape) => {
        const roomId = Array.from(socket.rooms).pop();
        if (!roomId || !boards[roomId]) return;
        boards[roomId] = boards[roomId].map((s) =>
            s.id != shape.id ? s : shape
        );
        socket.broadcast.to(roomId).emit('update-shape', shape);
    });

    socket.on('remove', (id: string) => {
        const roomId = Array.from(socket.rooms).pop();
        if (!roomId) return;
        boards[roomId] = boards[roomId].filter((s) => s.id != id);
        io.to(roomId).emit('delete-shape', id);
    });
});

io.listen(5000);
console.log('Server listening on *:5000');
