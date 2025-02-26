import express from 'express';
import cors from 'cors';
import router from './routes/notificationRoutes';
import { setupSwagger } from './swagger/swagger';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger docs
setupSwagger(app);

// Routes
app.use('/', router);

// Simple error handler. Here we can add logic for AWS or GCP
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

export default app;