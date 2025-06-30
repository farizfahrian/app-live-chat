import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env) 
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST_NAME || 'localhost';
const port = parseInt(process.env.PORT || '3000');

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handle);
    const io = new Server(httpServer);
    const rooms = new Map<string, Set<string>>();

    io.on('connection', (socket) => {
        console.log('Client connected: ', socket.id);
        socket.on('join_room', ({ room, username }) => {
            if (!rooms.has(room)) {
                rooms.set(room, new Set());
            }
            const roomUsers = rooms.get(room);
            if (roomUsers?.has(username)) {
                socket.emit('username_taken', 'Username is already taken in this room');
                return;
            }
            roomUsers?.add(username);
            socket.join(room);
            socket.emit('join_success', 'Joined room successfully');

            socket.to(room).emit('user_joined', `${username} joined room`);

            socket.on('disconnect', () => {
                roomUsers?.delete(username);
                if (roomUsers?.size === 0) {
                    rooms.delete(room);
                } else {
                    socket.to(room).emit('user_left', `${username} left room`);
                }
            });
        });

        socket.on('message', ({ room, message, sender }) => {
            console.log(`${sender} sent message on room: ${room}, message: ${message}`);
            io.to(room).emit('message', {message, sender});
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected: ', socket.id);
        });
    });

    httpServer.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}`);
    });
});
