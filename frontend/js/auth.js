const VALID_USERS = [
    { username: 'staff', password: 'staff123', role: 'staff', name: 'Maria Santos' },
    { username: 'nurse', password: 'nurse123', role: 'nurse', name: 'Anna Reyes' },
    { username: 'doctor', password: 'doctor123', role: 'doctor', name: 'Dr. James Cruz' },
    { username: 'admin', password: 'admin123', role: 'admin', name: 'John Dela Cruz' }
];

let currentUser = null;
let sentOTP = null;

function validateLogin(username, password) {
    return VALID_USERS.find(u => u.username === username && u.password === password);
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function verifyOTP(inputOTP, sentOTP) {
    return inputOTP === sentOTP;
}

function saveUserSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getUserSession() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function clearUserSession() {
    localStorage.removeItem('currentUser');
}