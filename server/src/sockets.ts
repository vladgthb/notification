import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let ioInstance: Server | null = null;

// Optionally we can track userId -> socketId
const userSocketMap = new Map<string, string>();

export function initSocket(httpServer: HttpServer) {
    ioInstance = new Server(httpServer, {
        cors: {
            origin: '*', // In production, we can restrict to our domain, for now cors are opened
        },
    });

    ioInstance.on('connection', (socket) => {
        const { userId } = socket.handshake.query;
        console.log(`New socket connected: ${socket.id} for userId: ${userId}`);
        if (typeof userId === 'string') {
            userSocketMap.set(userId, socket.id);
            socket.join(userId);
            console.log(`Socket ${socket.id} joined room: ${userId}`);
        }
        socket.on('disconnect', () => {
            if (typeof userId === 'string') {
                userSocketMap.delete(userId);
                console.log(`Socket ${socket.id} disconnected and removed from room ${userId}`);
            }
        });
    });
}

export function io() {
    return ioInstance;
}