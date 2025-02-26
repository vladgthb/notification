import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());

// Simple error handler. Here we can add logic for AWS or GCP
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

export default app;