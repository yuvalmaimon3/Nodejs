const express = require('express');
const axios = require('axios');
const client = require('prom-client');

const app = express();
const PORT = 3000;

// NASA API details
const NASA_API_KEY = 'SkftPsa2BiSyTgJNTEqBM7';
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod'; // Example NASA API endpoint

// Create a new registry for Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Create a custom counter metric for HTTP requests
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
});
register.registerMetric(httpRequestCounter);

// Create a histogram to measure HTTP response times
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 1.5, 2, 5], // Buckets for response times in seconds
});
register.registerMetric(httpRequestDuration);

// Increment the counter and measure response time on each request
app.use((req, res, next) => {
    httpRequestCounter.inc(); // Increment the HTTP request counter

    // Start the timer for measuring response time
    const end = httpRequestDuration.startTimer();

    res.on('finish', () => {
        // Stop the timer and log the labels: method, route, and status code
        end({ method: req.method, route: req.route && req.route.path || req.url, status_code: res.statusCode });

    });

    next();
});

// NASA API route
app.get('/nasa', async (req, res) => {
    try {
        const response = await axios.get(`${NASA_API_URL}?api_key=${NASA_API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from NASA API');
    }
});

// Expose metrics at /metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Start the server on port 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
