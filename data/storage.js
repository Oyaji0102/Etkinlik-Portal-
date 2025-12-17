const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.join(__dirname, 'events.json');
const REGISTRATIONS_FILE = path.join(__dirname, 'registrations.json');

// Initialize data files if they don't exist
function initializeDataFiles() {
    if (!fs.existsSync(EVENTS_FILE)) {
        fs.writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
        fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
    }
}

// Events CRUD operations
function getAllEvents() {
    initializeDataFiles();
    const data = fs.readFileSync(EVENTS_FILE, 'utf8');
    return JSON.parse(data);
}

function getEventById(id) {
    const events = getAllEvents();
    return events.find(event => event.id === id);
}

function createEvent(event) {
    const events = getAllEvents();
    events.push(event);
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
    return event;
}

function updateEvent(id, updatedEvent) {
    const events = getAllEvents();
    const index = events.findIndex(event => event.id === id);
    if (index !== -1) {
        events[index] = { ...events[index], ...updatedEvent };
        fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
        return events[index];
    }
    return null;
}

function deleteEvent(id) {
    const events = getAllEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(filteredEvents, null, 2));
    return filteredEvents.length < events.length;
}

// Registrations CRUD operations
function getAllRegistrations() {
    initializeDataFiles();
    const data = fs.readFileSync(REGISTRATIONS_FILE, 'utf8');
    return JSON.parse(data);
}

function getRegistrationsByEventId(eventId) {
    const registrations = getAllRegistrations();
    return registrations.filter(reg => reg.eventId === eventId);
}

function getRegistrationsByUserEmail(email) {
    const registrations = getAllRegistrations();
    return registrations.filter(reg => reg.userEmail === email);
}

function createRegistration(registration) {
    const registrations = getAllRegistrations();
    // Check if user is already registered for this event
    const existingReg = registrations.find(
        reg => reg.eventId === registration.eventId && reg.userEmail === registration.userEmail
    );
    if (existingReg) {
        return null; // Already registered
    }
    registrations.push(registration);
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
    return registration;
}

function deleteRegistration(id) {
    const registrations = getAllRegistrations();
    const filteredRegistrations = registrations.filter(reg => reg.id !== id);
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(filteredRegistrations, null, 2));
    return filteredRegistrations.length < registrations.length;
}

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllRegistrations,
    getRegistrationsByEventId,
    getRegistrationsByUserEmail,
    createRegistration,
    deleteRegistration
};
