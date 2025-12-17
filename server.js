const express = require('express');
const path = require('path');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const rateLimiter = require('./utils/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Apply rate limiting to API routes
app.use('/api', rateLimiter);

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Etkinlik Portal sunucusu ${PORT} portunda çalışıyor`);
    console.log(`http://localhost:${PORT} adresinden erişebilirsiniz`);
});
