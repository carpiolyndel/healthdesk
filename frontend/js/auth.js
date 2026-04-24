let pendingUser = null;
let generatedOtp = null;
let otpExpiry = null;
let otpTimer = null;

function getCurrentUser() {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (stored) return JSON.parse(stored);
    return null;
}

function checkAuth(allowedRoles) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        window.location.href = 'login.html';
        return null;
    }
    
    return user;
}

function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.href = 'login.html';
}

async function sendOtpEmail(email, otp, name) {
    console.log('DEMO MODE - OTP for', email, ':', otp);
    showToast(`DEMO OTP: ${otp}`, 'info');
    return true;
}

async function login(username, password) {
    console.log('Login attempt:', username);
    
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    
    console.log('Users found:', systemUsers.length);
    
    if (systemUsers.length === 0) {
        console.log('No users, creating defaults...');
        systemUsers = [
            { id: 1, username: 'admin', fullname: 'Admin User', email: 'admin@healthdesk.com', role: 'ADMIN', status: 'Active', password: 'admin123', lastLogin: '2026-03-10' },
            { id: 2, username: 'doctor', fullname: 'Dr. James Cruz', email: 'doctor@healthdesk.com', role: 'DOCTOR', status: 'Active', password: 'doctor123', lastLogin: '2026-03-10' },
            { id: 3, username: 'nurse', fullname: 'Anna Reyes', email: 'nurse@healthdesk.com', role: 'NURSE', status: 'Active', password: 'nurse123', lastLogin: '2026-03-09' },
            { id: 4, username: 'staff', fullname: 'Maria Santos', email: 'staff@healthdesk.com', role: 'STAFF', status: 'Active', password: 'staff123', lastLogin: '2026-03-10' }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
    }
    
    const user = systemUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log('User found:', user.username);
        
        if (user.status !== 'Active') {
            showToast('Account is inactive', 'error');
            return { success: false, message: 'Account is inactive' };
        }
        
        pendingUser = user;
        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpExpiry = Date.now() + 5 * 60 * 1000;
        
        await sendOtpEmail(user.email, generatedOtp, user.fullname);
        showToast(`OTP sent to ${user.email}`, 'success');
        
        return { success: true, user: user, otp: generatedOtp };
    }
    
    console.log('User not found:', username);
    showToast('Invalid username or password', 'error');
    return { success: false, message: 'Invalid username or password' };
}

function verifyOtp(enteredOtp) {
    if (Date.now() > otpExpiry) {
        showToast('OTP expired', 'error');
        return { success: false, message: 'OTP expired' };
    }
    
    if (enteredOtp === generatedOtp) {
        const userData = {
            id: pendingUser.id,
            username: pendingUser.username,
            role: pendingUser.role,
            name: pendingUser.fullname,
            email: pendingUser.email
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
        return { success: true, user: userData, dashboard: getDashboardUrl(pendingUser.role) };
    }
    
    showToast('Invalid OTP', 'error');
    return { success: false, message: 'Invalid OTP' };
}

function getDashboardUrl(role) {
    const dashboards = {
        ADMIN: 'admin.html',
        DOCTOR: 'doctor.html',
        NURSE: 'nurse.html',
        STAFF: 'staff.html'
    };
    return dashboards[role] || 'login.html';
}

function resendOtp() {
    if (!pendingUser) return false;
    
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpExpiry = Date.now() + 5 * 60 * 1000;
    sendOtpEmail(pendingUser.email, generatedOtp, pendingUser.fullname);
    return true;
}

function startOtpTimer(onExpire) {
    const timerEl = document.getElementById('timerDisplay');
    if (!timerEl) return;
    
    if (otpTimer) clearInterval(otpTimer);
    
    otpTimer = setInterval(() => {
        const remaining = otpExpiry - Date.now();
        
        if (remaining <= 0) {
            clearInterval(otpTimer);
            timerEl.innerHTML = 'Code expired';
            timerEl.classList.add('expired');
            if (onExpire) onExpire();
        } else {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            timerEl.innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            timerEl.classList.remove('expired');
        }
    }, 1000);
}