const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    TIMEOUT: 30000,
    VERSION: '1.0.0'
};

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'npKnUDMwHaijuVsN7',
    SERVICE_ID: 'service_munourv',
    TEMPLATE_ID: 'template_s4fmtyg'
};

const ROLES = {
    ADMIN: 'ADMIN',
    DOCTOR: 'DOCTOR',
    NURSE: 'NURSE',
    STAFF: 'STAFF',
    GUEST: 'GUEST'
};

const APPOINTMENT_STATUS = {
    SCHEDULED: 'SCHEDULED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    PENDING: 'PENDING'
};

const STORAGE_KEYS = {
    CURRENT_USER: 'currentUser',
    TOKEN: 'token',
    THEME: 'theme'
};

const DEFAULT_USERS = [
    { id: 1, username: 'admin', password: 'admin123', role: ROLES.ADMIN, name: 'Admin User', email: 'admin@healthdesk.com' },
    { id: 2, username: 'doctor', password: 'doctor123', role: ROLES.DOCTOR, name: 'Dr. James Cruz', email: 'doctor@healthdesk.com' },
    { id: 3, username: 'nurse', password: 'nurse123', role: ROLES.NURSE, name: 'Anna Reyes', email: 'nurse@healthdesk.com' },
    { id: 4, username: 'staff', password: 'staff123', role: ROLES.STAFF, name: 'Maria Santos', email: 'staff@healthdesk.com' }
];