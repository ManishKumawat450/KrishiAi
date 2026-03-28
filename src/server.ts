import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import routes
import routes from './routes'; // Assuming routes are defined in src/routes/index.ts

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes integration
app.use('/api', routes); // Assuming all API routes are stored under /api

// AI agents orchestration logic
app.get('/api/agents', (req, res) => {
    // Placeholder for AI agent orchestration logic
    res.json({ message: 'AI agents orchestrated successfully!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
