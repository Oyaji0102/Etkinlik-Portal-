// Simple HTML sanitization to prevent XSS attacks
function sanitizeHtml(str) {
    if (typeof str !== 'string') return str;
    
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
    };
    
    return str.replace(/[&<>"'/]/g, (match) => htmlEntities[match]);
}

module.exports = {
    sanitizeHtml
};
