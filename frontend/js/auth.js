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
    console.log('========================================');
    console.log('📧 Sending OTP Email');
    console.log('📧 To:', email);
    console.log('🔐 OTP Code:', otp);
    console.log('========================================');
    
    if (email === 'demo@healthdesk.com' || !email || email.includes('@example.com')) {
        console.log('⚠️ DEMO MODE - Showing OTP on screen');
        showToast(`🔐 Your OTP is: ${otp}`, 'info');
        return true;
    }
    
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS not loaded!');
        showToast(`⚠️ Email service unavailable. Your OTP is: ${otp}`, 'warning');
        return false;
    }
    
    try {
        const expiryTime = new Date(Date.now() + 5 * 60 * 1000);
        const formattedExpiry = expiryTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        const templateParams = {
            to_name: name,
            to_email: email,
            otp_code: otp,
            expiry_time: formattedExpiry,
            current_year: new Date().getFullYear(),
            clinic_name: 'HealthDesk Clinic',
            clinic_address: 'Cawayan, Catarman, Northern Samar'
        };
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.PUBLIC_KEY
        );
        
        if (response.status === 200) {
            console.log('✅ Email sent successfully');
            showToast(`✅ Verification code sent to ${email}`, 'success');
            return true;
        } else {
            console.error('❌ Email failed:', response);
            showToast(`⚠️ Email failed. Your OTP is: ${otp}`, 'warning');
            return false;
        }
    } catch (error) {
        console.error('❌ Email error:', error);
        showToast(`⚠️ Cannot send email. Your OTP is: ${otp}`, 'warning');
        return false;
    }
}

async function login(username, password) {
    console.log('🔐 Login attempt for:', username);
    
    let systemUsers = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    
    if (systemUsers.length === 0) {
        systemUsers = [
            { id: 1, username: 'admin', fullname: 'Admin User', email: 'demo@healthdesk.com', role: 'ADMIN', status: 'Active', password: 'admin123', lastLogin: '2026-03-10' },
            { id: 2, username: 'doctor', fullname: 'Dr. James Cruz', email: 'demo@healthdesk.com', role: 'DOCTOR', status: 'Active', password: 'doctor123', lastLogin: '2026-03-10' },
            { id: 3, username: 'nurse', fullname: 'Anna Reyes', email: 'demo@healthdesk.com', role: 'NURSE', status: 'Active', password: 'nurse123', lastLogin: '2026-03-09' },
            { id: 4, username: 'staff', fullname: 'Maria Santos', email: 'demo@healthdesk.com', role: 'STAFF', status: 'Active', password: 'staff123', lastLogin: '2026-03-10' },
            { id: 5, username: 'carpio', fullname: 'Carpio, Lyndel J.', email: 'carpio.lyndeljcarpio@gmail.com', role: 'STAFF', status: 'Active', password: 'carpio123', lastLogin: 'Never' }
        ];
        localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
        console.log('✅ Default users added!');
    }
    
    const user = systemUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log('✅ User found:', user.username);
        console.log('📧 User email:', user.email);
        
        if (user.status !== 'Active') {
            showToast('Account is inactive. Please contact admin.', 'error');
            return { success: false, message: 'Account is inactive' };
        }
        
        pendingUser = user;
        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpExpiry = Date.now() + 5 * 60 * 1000;
        
        const emailSent = await sendOtpEmail(user.email, generatedOtp, user.fullname);
        
        if (emailSent) {
            showToast(`Verification code sent to ${user.email}`, 'success');
        }
        
        return { success: true, user: user, otp: generatedOtp };
    }
    
    console.log('❌ User not found:', username);
    showToast('Invalid username or password', 'error');
    return { success: false, message: 'Invalid username or password' };
}

function verifyOtp(enteredOtp) {
    console.log('🔐 Verifying OTP:', enteredOtp);
    console.log('🔐 Expected OTP:', generatedOtp);
    
    if (Date.now() > otpExpiry) {
        showToast('OTP expired. Please request a new one.', 'error');
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
        console.log('✅ OTP verified! Redirecting to:', getDashboardUrl(pendingUser.role));
        
        return { success: true, user: userData, dashboard: getDashboardUrl(pendingUser.role) };
    }
    
    console.log('❌ OTP mismatch!');
    showToast('Invalid verification code', 'error');
    return { success: false, message: 'Invalid verification code' };
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
    showToast('New verification code sent!', 'success');
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