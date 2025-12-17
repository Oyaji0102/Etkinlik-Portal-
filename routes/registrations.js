const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const storage = require('../data/storage');
const { sanitizeHtml } = require('../utils/sanitize');

// Get all registrations for an event
router.get('/event/:eventId', (req, res) => {
    try {
        const registrations = storage.getRegistrationsByEventId(req.params.eventId);
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Kayıtlar yüklenemedi' });
    }
});

// Get all registrations for a user
router.get('/user/:email', (req, res) => {
    try {
        const registrations = storage.getRegistrationsByUserEmail(req.params.email);
        const eventsWithDetails = registrations.map(reg => {
            const event = storage.getEventById(reg.eventId);
            return {
                ...reg,
                event
            };
        });
        res.json(eventsWithDetails);
    } catch (error) {
        res.status(500).json({ error: 'Kayıtlar yüklenemedi' });
    }
});

// Create new registration
router.post('/', (req, res) => {
    try {
        const { eventId, userName, userEmail } = req.body;
        
        // Validation
        if (!eventId || !userName || !userEmail) {
            return res.status(400).json({ error: 'Gerekli alanlar eksik' });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
            return res.status(400).json({ error: 'Geçersiz e-posta adresi' });
        }
        
        // Check if event exists
        const event = storage.getEventById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Etkinlik bulunamadı' });
        }
        
        // Check capacity
        if (event.capacity) {
            const currentRegistrations = storage.getRegistrationsByEventId(eventId);
            if (currentRegistrations.length >= event.capacity) {
                return res.status(400).json({ error: 'Etkinlik kapasitesi dolu' });
            }
        }
        
        const newRegistration = {
            id: uuidv4(),
            eventId,
            userName: sanitizeHtml(userName),
            userEmail: sanitizeHtml(userEmail),
            registeredAt: new Date().toISOString()
        };
        
        const createdRegistration = storage.createRegistration(newRegistration);
        
        if (createdRegistration) {
            res.status(201).json(createdRegistration);
        } else {
            res.status(400).json({ error: 'Bu etkinliğe zaten kayıt oldunuz' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Kayıt oluşturulamadı' });
    }
});

// Cancel registration
router.delete('/:id', (req, res) => {
    try {
        const deleted = storage.deleteRegistration(req.params.id);
        if (deleted) {
            res.json({ message: 'Kayıt iptal edildi' });
        } else {
            res.status(404).json({ error: 'Kayıt bulunamadı' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Kayıt iptal edilemedi' });
    }
});

module.exports = router;
