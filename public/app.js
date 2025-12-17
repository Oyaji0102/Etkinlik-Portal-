// Global state
let currentEvents = [];
let currentFilter = '';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Create event form
    document.getElementById('create-event-form').addEventListener('submit', handleCreateEvent);
    
    // Registration form
    document.getElementById('registration-form').addEventListener('submit', handleRegistration);
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'events') {
        loadEvents();
    }
}

// Load all events
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        const events = await response.json();
        currentEvents = events;
        displayEvents(events);
    } catch (error) {
        showError('Etkinlikler yüklenirken bir hata oluştu');
    }
}

// Display events
function displayEvents(events) {
    const eventsList = document.getElementById('events-list');
    
    if (events.length === 0) {
        eventsList.innerHTML = '<p style="text-align: center; color: #666;">Henüz etkinlik bulunmuyor.</p>';
        return;
    }
    
    eventsList.innerHTML = events.map(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="event-card">
                <span class="event-type ${event.type}">${event.type}</span>
                <h3>${event.title}</h3>
                ${event.description ? `<p>${event.description}</p>` : ''}
                <div class="event-info">
                    <strong>📅</strong> <span>${formattedDate}</span>
                </div>
                ${event.location ? `
                    <div class="event-info">
                        <strong>📍</strong> <span>${event.location}</span>
                    </div>
                ` : ''}
                <div class="event-info">
                    <strong>👤</strong> <span>Organizatör: ${event.organizerName}</span>
                </div>
                ${event.capacity ? `
                    <div class="event-info">
                        <strong>👥</strong> <span>Kapasite: ${event.capacity} kişi</span>
                    </div>
                ` : ''}
                <button class="btn btn-primary" onclick="openRegistrationModal('${event.id}')">
                    Kayıt Ol
                </button>
            </div>
        `;
    }).join('');
}

// Filter events by type
function filterEvents() {
    const filterType = document.getElementById('filter-type').value;
    currentFilter = filterType;
    
    if (filterType === '') {
        displayEvents(currentEvents);
    } else {
        const filtered = currentEvents.filter(event => event.type === filterType);
        displayEvents(filtered);
    }
}

// Handle create event
async function handleCreateEvent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        title: formData.get('title'),
        type: formData.get('type'),
        description: formData.get('description'),
        date: formData.get('date'),
        location: formData.get('location'),
        organizerName: formData.get('organizerName'),
        capacity: formData.get('capacity') ? parseInt(formData.get('capacity')) : null
    };
    
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            showSuccess('Etkinlik başarıyla oluşturuldu!');
            e.target.reset();
            loadEvents();
            // Switch to events tab
            setTimeout(() => {
                document.querySelector('.tab-button:first-child').click();
            }, 1500);
        } else {
            const error = await response.json();
            showError(error.error || 'Etkinlik oluşturulamadı');
        }
    } catch (error) {
        showError('Etkinlik oluşturulurken bir hata oluştu');
    }
}

// Open registration modal
function openRegistrationModal(eventId) {
    document.getElementById('reg-event-id').value = eventId;
    document.getElementById('registration-modal').style.display = 'block';
}

// Close registration modal
function closeRegistrationModal() {
    document.getElementById('registration-modal').style.display = 'none';
    document.getElementById('registration-form').reset();
}

// Handle registration
async function handleRegistration(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('reg-event-id').value;
    const userName = document.getElementById('reg-user-name').value;
    const userEmail = document.getElementById('reg-user-email').value;
    
    const registrationData = {
        eventId,
        userName,
        userEmail
    };
    
    try {
        const response = await fetch('/api/registrations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });
        
        if (response.ok) {
            showSuccess('Etkinliğe başarıyla kayıt oldunuz!');
            closeRegistrationModal();
        } else {
            const error = await response.json();
            showError(error.error || 'Kayıt oluşturulamadı');
        }
    } catch (error) {
        showError('Kayıt yapılırken bir hata oluştu');
    }
}

// Load my registrations
async function loadMyRegistrations() {
    const email = document.getElementById('user-email-check').value.trim();
    
    if (!email) {
        showError('Lütfen e-posta adresinizi girin');
        return;
    }
    
    try {
        const response = await fetch(`/api/registrations/user/${encodeURIComponent(email)}`);
        const registrations = await response.json();
        
        const listDiv = document.getElementById('my-registrations-list');
        
        if (registrations.length === 0) {
            listDiv.innerHTML = '<p style="text-align: center; color: #666;">Henüz kayıt olduğunuz etkinlik bulunmuyor.</p>';
            return;
        }
        
        listDiv.innerHTML = registrations.map(reg => {
            const event = reg.event;
            if (!event) return '';
            
            const eventDate = new Date(event.date);
            const formattedDate = eventDate.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="event-card">
                    <span class="event-type ${event.type}">${event.type}</span>
                    <h3>${event.title}</h3>
                    ${event.description ? `<p>${event.description}</p>` : ''}
                    <div class="event-info">
                        <strong>📅</strong> <span>${formattedDate}</span>
                    </div>
                    ${event.location ? `
                        <div class="event-info">
                            <strong>📍</strong> <span>${event.location}</span>
                        </div>
                    ` : ''}
                    <div class="event-info">
                        <strong>✅</strong> <span>Kayıtlı</span>
                    </div>
                    <button class="btn btn-danger" onclick="cancelRegistration('${reg.id}')">
                        Kaydı İptal Et
                    </button>
                </div>
            `;
        }).join('');
    } catch (error) {
        showError('Kayıtlar yüklenirken bir hata oluştu');
    }
}

// Cancel registration
async function cancelRegistration(registrationId) {
    if (!confirm('Kaydınızı iptal etmek istediğinizden emin misiniz?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/registrations/${registrationId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showSuccess('Kayıt iptal edildi');
            loadMyRegistrations();
        } else {
            showError('Kayıt iptal edilemedi');
        }
    } catch (error) {
        showError('Kayıt iptal edilirken bir hata oluştu');
    }
}

// Show success message
function showSuccess(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Show error message
function showError(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('registration-modal');
    if (event.target === modal) {
        closeRegistrationModal();
    }
}
