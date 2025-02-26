import * as http from 'http';
import app from './src/app';
import { initSocket } from './src/sockets';
import './src/workers/notificationWorker';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});