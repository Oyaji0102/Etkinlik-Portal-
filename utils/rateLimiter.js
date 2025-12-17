// Simple in-memory rate limiter for file system access protection
const requestCounts = new Map();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return next();
    }
    
    const record = requestCounts.get(ip);
    
    // Reset if window has passed
    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + WINDOW_MS;
        return next();
    }
    
    // Check if limit exceeded
    if (record.count >= MAX_REQUESTS) {
        return res.status(429).json({ 
            error: 'Çok fazla istek. Lütfen bir dakika sonra tekrar deneyin.' 
        });
    }
    
    record.count++;
    next();
}

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requestCounts.entries()) {
        if (now > record.resetTime) {
            requestCounts.delete(ip);
        }
    }
}, 300000);

module.exports = rateLimiter;
