let systemUsers = [];
        let archivedUsers = [];
        let guestInquiries = [];
        let currentPage = 1;
        let rowsPerPage = 10;
        let currentFilter = '';
        let currentInquiryFilter = 'all';

        function showToast(message, type) {
            let container = document.querySelector('.toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
            container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function getCurrentUser() {
            const stored = localStorage.getItem('currentUser');
            if (stored) return JSON.parse(stored);
            return null;
        }

        function checkAuth() {
            const user = getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                window.location.href = 'login.html';
                return null;
            }
            return user;
        }

        function logout() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }

        function loadData() {
            const storedUsers = localStorage.getItem('systemUsers');
            const storedArchived = localStorage.getItem('archivedUsers');
            const storedInquiries = localStorage.getItem('guestInquiries');
            
            if (storedUsers) {
                systemUsers = JSON.parse(storedUsers);
            } else {
                systemUsers = [
                    { id: 1, username: 'admin', fullname: 'Admin User', email: 'admin@healthdesk.com', role: 'ADMIN', status: 'Active', password: 'admin123', lastLogin: '2026-03-10' },
                    { id: 2, username: 'doctor', fullname: 'Dr. James Cruz', email: 'doctor@healthdesk.com', role: 'DOCTOR', status: 'Active', password: 'doctor123', lastLogin: '2026-03-10' },
                    { id: 3, username: 'nurse', fullname: 'Anna Reyes', email: 'nurse@healthdesk.com', role: 'NURSE', status: 'Active', password: 'nurse123', lastLogin: '2026-03-09' },
                    { id: 4, username: 'staff', fullname: 'Maria Santos', email: 'staff@healthdesk.com', role: 'STAFF', status: 'Active', password: 'staff123', lastLogin: '2026-03-10' }
                ];
                localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
            }
            
            if (storedArchived) {
                archivedUsers = JSON.parse(storedArchived);
            } else {
                archivedUsers = [];
                localStorage.setItem('archivedUsers', JSON.stringify(archivedUsers));
            }
            
            if (storedInquiries) {
                guestInquiries = JSON.parse(storedInquiries);
            } else {
                guestInquiries = [];
                localStorage.setItem('guestInquiries', JSON.stringify(guestInquiries));
            }
        }

        function saveToStorage() {
            localStorage.setItem('systemUsers', JSON.stringify(systemUsers));
            localStorage.setItem('archivedUsers', JSON.stringify(archivedUsers));
            localStorage.setItem('guestInquiries', JSON.stringify(guestInquiries));
        }

        function updateStats() {
            document.getElementById('totalUsers').textContent = systemUsers.length;
            document.getElementById('totalDoctors').textContent = systemUsers.filter(u => u.role === 'DOCTOR').length;
            document.getElementById('totalNurses').textContent = systemUsers.filter(u => u.role === 'NURSE').length;
            document.getElementById('totalStaff').textContent = systemUsers.filter(u => u.role === 'STAFF').length;
        }

        function renderRecentUsersTable() {
            const tbody = document.getElementById('tableBody');
            if (!tbody) return;
            
            let filtered = [...systemUsers];
            if (currentFilter) {
                filtered = filtered.filter(u => u.username.toLowerCase().includes(currentFilter) || u.fullname.toLowerCase().includes(currentFilter));
            }
            const start = (currentPage - 1) * rowsPerPage;
            const pageUsers = filtered.slice(start, start + rowsPerPage);
            
            if (pageUsers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No users found<\/td><\/tr>';
            } else {
                tbody.innerHTML = pageUsers.map(u => `
                    <tr><td>${escapeHtml(u.username)}</td><td>${escapeHtml(u.fullname)}</td><td><span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span></td><td class="status-${u.status.toLowerCase()}">${u.status}</td></tr>
                `).join('');
            }
            const totalPages = Math.ceil(filtered.length / rowsPerPage);
            let paginationHtml = '';
            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            document.getElementById('pagination').innerHTML = paginationHtml;
        }

        function goToPage(page) { currentPage = page; renderRecentUsersTable(); }

        function initCharts() {
            new Chart(document.getElementById('areaChart'), {
                type: 'line',
                data: { labels: ['Week1', 'Week2', 'Week3', 'Week4'], datasets: [{ label: 'New Users', data: [5, 8, 12, 6], borderColor: '#0d9488', fill: true, backgroundColor: 'rgba(13,148,136,0.1)' }] }
            });
            new Chart(document.getElementById('barChart'), {
                type: 'bar',
                data: { labels: ['Admin', 'Doctor', 'Nurse', 'Staff'], datasets: [{ label: 'Users by Role', data: [
                    systemUsers.filter(u => u.role === 'ADMIN').length,
                    systemUsers.filter(u => u.role === 'DOCTOR').length,
                    systemUsers.filter(u => u.role === 'NURSE').length,
                    systemUsers.filter(u => u.role === 'STAFF').length
                ], backgroundColor: '#0d9488' }] }
            });
        }

        function renderUsers() {
            const tbody = document.getElementById('usersList');
            if (!tbody) return;
            if (systemUsers.length === 0) {
                tbody.innerHTML = '</table><td colspan="6" style="text-align:center;">No users found<\/td><\/tr>';
                return;
            }
            tbody.innerHTML = systemUsers.map(u => `
                <tr>
                    <td>${escapeHtml(u.username)}</div>
                    <td>${escapeHtml(u.fullname)}</div>
                    <td><span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span></div>
                    <td class="status-${u.status.toLowerCase()}">${u.status}</div>
                    <td><span style="font-family:monospace;">••••••••</span></div>
                    <td>
                        <button class="btn-edit" onclick="editUser(${u.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-archive" onclick="archiveUser(${u.id})"><i class="fas fa-archive"></i></button>
                        <button class="btn-cancel" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
                        <button class="reset-password-btn" onclick="openResetPasswordModal(${u.id})"><i class="fas fa-key"></i> Reset</button>
                    </div>
                </tr>
            `).join('');
        }

        function renderArchive() {
            const tbody = document.getElementById('archiveList');
            if (!tbody) return;
            if (archivedUsers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No archived users<\/td><\/tr>';
                return;
            }
            tbody.innerHTML = archivedUsers.map(u => `
                <tr>
                    <td>${escapeHtml(u.username)}</div>
                    <td>${escapeHtml(u.fullname)}</div>
                    <td><span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span></div>
                    <td>${u.archivedDate}</div>
                    <td><button class="btn-cancel" onclick="permanentDelete(${u.id})"><i class="fas fa-trash"></i> Delete</button></div>
                </tr>
            `).join('');
        }

        function renderInquiries() {
            const container = document.getElementById('inquiriesList');
            const noInquiriesDiv = document.getElementById('noInquiries');
            if (!container) return;
            
            let filtered = [...guestInquiries];
            if (currentInquiryFilter !== 'all') {
                filtered = filtered.filter(i => i.status === currentInquiryFilter);
            }
            
            if (filtered.length === 0) {
                container.style.display = 'none';
                if (noInquiriesDiv) noInquiriesDiv.style.display = 'block';
                return;
            }
            
            container.style.display = 'block';
            if (noInquiriesDiv) noInquiriesDiv.style.display = 'none';
            container.innerHTML = filtered.map(inquiry => `
                <div class="inquiry-card">
                    <div class="inquiry-header">
                        <div class="inquiry-name"><i class="fas fa-user"></i> ${escapeHtml(inquiry.name)} <span class="inquiry-status status-${inquiry.status === 'replied' ? 'replied' : 'pending'}">${inquiry.status === 'replied' ? 'Replied' : 'Pending'}</span></div>
                        <div class="inquiry-date"><i class="fas fa-calendar"></i> ${inquiry.date}</div>
                    </div>
                    <div class="inquiry-subject"><i class="fas fa-tag"></i> ${escapeHtml(inquiry.subject || 'General Inquiry')}</div>
                    <div class="inquiry-message">${escapeHtml(inquiry.message)}</div>
                    <div class="inquiry-contact">
                        <span><i class="fas fa-envelope"></i> ${escapeHtml(inquiry.email)}</span>
                        ${inquiry.phone ? `<span><i class="fas fa-phone"></i> ${escapeHtml(inquiry.phone)}</span>` : ''}
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        <button class="btn-primary" style="padding: 4px 12px; font-size: 12px;" onclick="markAsReplied(${inquiry.id})"><i class="fas fa-reply"></i> Mark as Replied</button>
                        <button class="btn-cancel" style="padding: 4px 12px; font-size: 12px;" onclick="deleteInquiry(${inquiry.id})"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            `).join('');
        }

        function markAsReplied(id) {
            const index = guestInquiries.findIndex(i => i.id === id);
            if (index !== -1) {
                guestInquiries[index].status = 'replied';
                saveToStorage();
                renderInquiries();
                showToast('Inquiry marked as replied', 'success');
            }
        }

        function deleteInquiry(id) {
            if (confirm('Delete this inquiry?')) {
                guestInquiries = guestInquiries.filter(i => i.id !== id);
                saveToStorage();
                renderInquiries();
                showToast('Inquiry deleted', 'success');
            }
        }

        function openUserModal() {
            document.getElementById('userId').value = '';
            document.getElementById('username').value = '';
            document.getElementById('fullname').value = '';
            document.getElementById('userEmail').value = '';
            document.getElementById('password').value = '';
            document.getElementById('passwordHint').innerHTML = '<i class="fas fa-info-circle"></i> Required for new user';
            document.getElementById('modalTitle').innerText = 'Add New User';
            document.getElementById('role').value = 'staff';
            document.getElementById('status').value = 'Active';
            document.getElementById('userModal').classList.add('active');
        }

        function closeUserModal() {
            document.getElementById('userModal').classList.remove('active');
        }

        function editUser(id) {
            const u = systemUsers.find(u => u.id === id);
            if (u) {
                document.getElementById('userId').value = u.id;
                document.getElementById('username').value = u.username;
                document.getElementById('fullname').value = u.fullname;
                document.getElementById('userEmail').value = u.email;
                document.getElementById('password').value = '';
                document.getElementById('passwordHint').innerHTML = '<i class="fas fa-info-circle"></i> Leave blank to keep current';
                document.getElementById('modalTitle').innerText = 'Edit User';
                document.getElementById('role').value = u.role.toLowerCase();
                document.getElementById('status').value = u.status;
                document.getElementById('userModal').classList.add('active');
            }
        }
function saveUser() {
    const id = document.getElementById('userId').value;
    const username = document.getElementById('username').value.trim();
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value.toUpperCase();
    const status = document.getElementById('status').value;
    
    if (!username || !fullname || !email) {
        showToast('Please fill all fields', 'error');
        return;
    }
    if (email && !validateEmail(email)) {
        showToast('Invalid email', 'error');
        return;
    }
    
    if (id) {
        const index = systemUsers.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            systemUsers[index] = { 
                ...systemUsers[index], 
                username, 
                fullname: fullname,
                email, 
                role, 
                status,
                password: password || systemUsers[index].password
            };
            showToast('User updated', 'success');
        }
    } else {
        if (!password) {
            showToast('Password required', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be 6+ characters', 'error');
            return;
        }
        const newId = systemUsers.length + 1;
        systemUsers.push({ 
            id: newId, 
            username, 
            fullname: fullname,
            email, 
            role, 
            status, 
            password: password,
            lastLogin: 'Never' 
        });
        showToast(`User "${username}" added successfully. They can now login.`, 'success');
    }
    saveToStorage();
    updateStats();
    renderUsers();
    renderRecentUsers();
    closeUserModal();
}

        function closeResetPasswordModal() {
            document.getElementById('resetPasswordModal').classList.remove('active');
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
            document.getElementById('passwordMatchError').innerHTML = '';
        }

        function resetPassword() {
            const userId = parseInt(document.getElementById('resetUserId').value);
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!newPassword) { document.getElementById('passwordMatchError').innerHTML = 'Enter new password'; return; }
            if (newPassword !== confirmPassword) { document.getElementById('passwordMatchError').innerHTML = 'Passwords do not match'; return; }
            if (newPassword.length < 6) { document.getElementById('passwordMatchError').innerHTML = 'Password must be 6+ characters'; return; }
            
            const index = systemUsers.findIndex(u => u.id === userId);
            if (index !== -1) {
                systemUsers[index].password = newPassword;
                saveToStorage();
                showToast('Password reset successful', 'success');
                closeResetPasswordModal();
                renderUsers();
            }
        }

        function archiveUser(id) {
            const u = systemUsers.find(u => u.id === id);
            if (u && confirm(`Archive "${u.username}"?`)) {
                systemUsers = systemUsers.filter(u => u.id !== id);
                archivedUsers.push({ ...u, archivedDate: new Date().toISOString().split('T')[0] });
                saveToStorage(); updateStats(); renderUsers(); renderArchive(); renderRecentUsersTable();
                showToast(`User ${u.username} archived`, 'success');
            }
        }

        function deleteUser(id) {
            const u = systemUsers.find(u => u.id === id);
            if (u && confirm(`Permanently delete "${u.username}"?`)) {
                systemUsers = systemUsers.filter(u => u.id !== id);
                saveToStorage(); updateStats(); renderUsers(); renderRecentUsersTable();
                showToast(`User ${u.username} deleted`, 'success');
            }
        }

        function permanentDelete(id) {
            const u = archivedUsers.find(u => u.id === id);
            if (u && confirm(`Permanently delete "${u.username}" from archive?`)) {
                archivedUsers = archivedUsers.filter(u => u.id !== id);
                saveToStorage(); renderArchive();
                showToast(`User removed from archive`, 'success');
            }
        }

        function searchUsers() {
            const query = document.getElementById('searchUsersInput').value.toLowerCase();
            const tbody = document.getElementById('usersList');
            if (!query) { renderUsers(); return; }
            const filtered = systemUsers.filter(u => u.username.toLowerCase().includes(query) || u.fullname.toLowerCase().includes(query));
            if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No users found<\/td><\/tr>'; return; }
            tbody.innerHTML = filtered.map(u => `
                <tr>
                    <td>${escapeHtml(u.username)}</div>
                    <td>${escapeHtml(u.fullname)}</div>
                    <td><span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span></div>
                    <td class="status-${u.status.toLowerCase()}">${u.status}</div>
                    <td><span style="font-family:monospace;">••••••••</span></div>
                    <td>
                        <button class="btn-edit" onclick="editUser(${u.id})">Edit</button>
                        <button class="btn-archive" onclick="archiveUser(${u.id})">Archive</button>
                        <button class="btn-cancel" onclick="deleteUser(${u.id})">Delete</button>
                        <button class="reset-password-btn" onclick="openResetPasswordModal(${u.id})">Reset</button>
                    </div>
                </tr>
            `).join('');
        }

        function searchArchive() {
            const query = document.getElementById('searchArchiveInput').value.toLowerCase();
            const tbody = document.getElementById('archiveList');
            if (!query) { renderArchive(); return; }
            const filtered = archivedUsers.filter(u => u.username.toLowerCase().includes(query) || u.fullname.toLowerCase().includes(query));
            if (filtered.length === 0) { tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No archived users found<\/td><\/tr>'; return; }
            tbody.innerHTML = filtered.map(u => `
                <tr>
                    <td>${escapeHtml(u.username)}</div>
                    <td>${escapeHtml(u.fullname)}</div>
                    <td><span class="role-badge role-${u.role.toLowerCase()}">${u.role}</span></div>
                    <td>${u.archivedDate}</div>
                    <td><button class="btn-cancel" onclick="permanentDelete(${u.id})">Delete</button></div>
                </tr>
            `).join('');
        }

        function searchRecentUsers() {
            currentFilter = document.getElementById('tableSearch').value.toLowerCase();
            currentPage = 1;
            renderRecentUsersTable();
        }

        function changeEntries() {
            rowsPerPage = parseInt(document.getElementById('entriesSelect').value);
            currentPage = 1;
            renderRecentUsersTable();
        }

        function generateUserReport() {
            document.getElementById('reportResult').innerHTML = `
                <div style="background:var(--gray-100);padding:20px;border-radius:16px;">
                    <h4>User Report</h4>
                    <p>Total Users: ${systemUsers.length}</p>
                    <p>Admins: ${systemUsers.filter(u => u.role === 'ADMIN').length}</p>
                    <p>Doctors: ${systemUsers.filter(u => u.role === 'DOCTOR').length}</p>
                    <p>Nurses: ${systemUsers.filter(u => u.role === 'NURSE').length}</p>
                    <p>Staff: ${systemUsers.filter(u => u.role === 'STAFF').length}</p>
                    <p>Archived: ${archivedUsers.length}</p>
                    <p>Guest Inquiries: ${guestInquiries.length}</p>
                    <button class="btn-primary" onclick="exportUserReport()" style="margin-top:15px;">Export CSV</button>
                </div>
            `;
        }

        function generateActivityReport() {
            document.getElementById('reportResult').innerHTML = `
                <div style="background:var(--gray-100);padding:20px;border-radius:16px;">
                    <h4>Activity Report</h4>
                    <p>Active Users: ${systemUsers.filter(u => u.status === 'Active').length}</p>
                    <p>Inactive Users: ${systemUsers.filter(u => u.status === 'Inactive').length}</p>
                    <p>Pending Inquiries: ${guestInquiries.filter(i => i.status === 'pending').length}</p>
                    <p>Replied Inquiries: ${guestInquiries.filter(i => i.status === 'replied').length}</p>
                    <p>System Active Since: March 6, 2026</p>
                </div>
            `;
        }

        function exportUserReport() {
            const data = systemUsers.map(u => ({ Username: u.username, Name: u.fullname, Email: u.email, Role: u.role, Status: u.status }));
            let csv = Object.keys(data[0]).join(',') + '\n';
            csv += data.map(row => Object.values(row).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'users_report.csv';
            a.click();
            URL.revokeObjectURL(blob);
            showToast('Report exported', 'success');
        }

        document.addEventListener('DOMContentLoaded', function() {
            const user = checkAuth();
            if (user) document.getElementById('userName').textContent = user.name;
            
            loadData();
            updateStats();
            renderUsers();
            renderArchive();
            renderRecentUsersTable();
            renderInquiries();
            initCharts();
            
            document.getElementById('addUserBtn')?.addEventListener('click', openUserModal);
            document.getElementById('closeUserModalBtn')?.addEventListener('click', closeUserModal);
            document.getElementById('cancelUserBtn')?.addEventListener('click', closeUserModal);
            document.getElementById('closeResetModalBtn')?.addEventListener('click', closeResetPasswordModal);
            document.getElementById('cancelResetBtn')?.addEventListener('click', closeResetPasswordModal);
            document.getElementById('resetPasswordForm')?.addEventListener('submit', (e) => { e.preventDefault(); resetPassword(); });
            document.getElementById('searchUsersBtn')?.addEventListener('click', searchUsers);
            document.getElementById('searchArchiveBtn')?.addEventListener('click', searchArchive);
            document.getElementById('userReportBtn')?.addEventListener('click', generateUserReport);
            document.getElementById('activityReportBtn')?.addEventListener('click', generateActivityReport);
            document.getElementById('logoutBtn')?.addEventListener('click', logout);
            document.getElementById('userForm')?.addEventListener('submit', (e) => { e.preventDefault(); saveUser(); });
            document.getElementById('entriesSelect')?.addEventListener('change', changeEntries);
            document.getElementById('tableSearch')?.addEventListener('input', searchRecentUsers);
            document.getElementById('sidebarSearch')?.addEventListener('input', (e) => {
                const q = e.target.value.toLowerCase();
                document.querySelectorAll('.nav-item[data-page]').forEach(item => {
                    if (item.getAttribute('data-page') === 'dashboard') return;
                    item.style.display = item.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
                });
            });
            document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('active');
            });
            
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    const page = this.dataset.page;
                    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                    this.classList.add('active');
                    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
                    document.getElementById(`${page}Page`).classList.add('active');
                    const titles = { dashboard: 'Dashboard', users: 'User Management', archive: 'Archive', reports: 'Reports', contact: 'Contact Inquiries' };
                    document.getElementById('pageTitle').innerText = titles[page] || 'Dashboard';
                    if (page === 'users') renderUsers();
                    if (page === 'archive') renderArchive();
                    if (page === 'dashboard') renderRecentUsersTable();
                    if (page === 'contact') renderInquiries();
                });
            });
            
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentInquiryFilter = this.dataset.filter;
                    renderInquiries();
                });
            });
        });
        
        window.goToPage = goToPage;
        window.editUser = editUser;
        window.archiveUser = archiveUser;
        window.deleteUser = deleteUser;
        window.permanentDelete = permanentDelete;
        window.exportUserReport = exportUserReport;
        window.openResetPasswordModal = openResetPasswordModal;
        window.closeResetPasswordModal = closeResetPasswordModal;
        window.resetPassword = resetPassword;
        window.markAsReplied = markAsReplied;
        window.deleteInquiry = deleteInquiry;