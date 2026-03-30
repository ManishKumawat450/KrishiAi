import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        service: 'KrishiAI Backend'
    });
});

// Routes integration
app.use('/api', apiRoutes);

// AI agents status endpoint
app.get('/api/agents/status', (_req, res) => {
    res.json({
        status: 'active',
        agents: {
            cropAgent: 'operational',
            diseaseAgent: 'operational',
            priceAgent: 'operational',
            fertilizerAgent: 'operational'
        },
        services: {
            weatherService: 'operational',
            nlpService: 'operational'
        },
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method
    });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`\n🌾 KrishiAI Server started successfully!`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log(`🤖 Agent status: http://localhost:${PORT}/api/agents/status`);
    console.log(`📚 API docs: http://localhost:${PORT}/api/docs\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

export default app;