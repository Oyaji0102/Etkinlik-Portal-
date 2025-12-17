const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const storage = require('../data/storage');
const { sanitizeHtml } = require('../utils/sanitize');

// Get all events
router.get('/', (req, res) => {
    try {
        const events = storage.getAllEvents();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Etkinlikler yüklenemedi' });
    }
});

// Get single event
router.get('/:id', (req, res) => {
    try {
        const event = storage.getEventById(req.params.id);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ error: 'Etkinlik bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Etkinlik yüklenemedi' });
    }
});

// Create new event
router.post('/', (req, res) => {
    try {
        const { title, type, description, date, location, organizerName, capacity } = req.body;
        
        // Validation
        if (!title || !type || !date || !organizerName) {
            return res.status(400).json({ error: 'Gerekli alanlar eksik' });
        }
        
        const validTypes = ['seminer', 'konser', 'atölye'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Geçersiz etkinlik türü. Seminer, konser veya atölye olmalı' });
        }
        
        const newEvent = {
            id: uuidv4(),
            title: sanitizeHtml(title),
            type,
            description: sanitizeHtml(description || ''),
            date,
            location: sanitizeHtml(location || ''),
            organizerName: sanitizeHtml(organizerName),
            capacity: capacity || null,
            createdAt: new Date().toISOString()
        };
        
        const createdEvent = storage.createEvent(newEvent);
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ error: 'Etkinlik oluşturulamadı' });
    }
});

// Update event
router.put('/:id', (req, res) => {
    try {
        const { title, type, description, date, location, organizerName, capacity } = req.body;
        
        const validTypes = ['seminer', 'konser', 'atölye'];
        if (type && !validTypes.includes(type)) {
            return res.status(400).json({ error: 'Geçersiz etkinlik türü' });
        }
        
        const updatedData = {};
        if (title) updatedData.title = sanitizeHtml(title);
        if (type) updatedData.type = type;
        if (description !== undefined) updatedData.description = sanitizeHtml(description);
        if (date) updatedData.date = date;
        if (location !== undefined) updatedData.location = sanitizeHtml(location);
        if (organizerName) updatedData.organizerName = sanitizeHtml(organizerName);
        if (capacity !== undefined) updatedData.capacity = capacity;
        
        const updatedEvent = storage.updateEvent(req.params.id, updatedData);
        
        if (updatedEvent) {
            res.json(updatedEvent);
        } else {
            res.status(404).json({ error: 'Etkinlik bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Etkinlik güncellenemedi' });
    }
});

// Delete event
router.delete('/:id', (req, res) => {
    try {
        const deleted = storage.deleteEvent(req.params.id);
        if (deleted) {
            res.json({ message: 'Etkinlik silindi' });
        } else {
            res.status(404).json({ error: 'Etkinlik bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Etkinlik silinemedi' });
    }
});

module.exports = router;
