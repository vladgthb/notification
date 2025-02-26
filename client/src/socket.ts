import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Initialize Socket.io for a given userId.
 */
export function initSocket(userId: string) {
    socket = io('http://localhost:4000', {
        query: { userId },
        transports: ['websocket']
    });
    socket.on('connect', () => {
        console.log('Socket connected for user:', userId);
    });
    socket.on('connect_error', (err) => {
        console.error('Socket connect error:', err);
    });
    socket.on('notification', (data) => {
        // For debug purpose
        console.log('Received notification:', data);
    });
}

/**
 * Getter for the socket instance.
 */
export function getSocket(): Socket | null {
    return socket;
}