import * as http from 'http';
import app from './app';
import { initSocket } from './sockets';
import './workers/notificationWorker';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});