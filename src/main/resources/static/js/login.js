const loginForm = document.getElementById('loginForm');
const mfaForm = document.getElementById('mfaForm');
const loginView = document.getElementById('loginView');
const mfaView = document.getElementById('mfaView');
const toast = document.getElementById('toast');

let generatedOtp = null;
let otpExpiry = null;

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    console.log('Demo OTP:', generatedOtp);
    showToast('OTP generated (check console for demo)', false);
    loginView.style.display = 'none';
    mfaView.style.display = 'block';
});

mfaForm.addEventListener('submit', e => {
    e.preventDefault();
    const entered = document.getElementById('otpCode').value.trim();
    if (Date.now() > otpExpiry) { showToast('OTP expired', true); return; }
    if (entered === generatedOtp) {
        showToast('Login successful!', false);
        setTimeout(() => window.location.href='dashboard.html', 500);
    } else showToast('Invalid OTP', true);
});

function backToLogin() {
    mfaView.style.display='none';
    loginView.style.display='block';
    document.getElementById('otpCode').value='';
}

function showToast(msg, isError){
    toast.textContent = msg;
    toast.className = 'toast-message show' + (isError ? ' error' : '');
    setTimeout(() => toast.classList.remove('show'), 3000);
}