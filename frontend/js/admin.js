let systemUsers = [
    { id: 1, username: 'admin', fullname: 'John Dela Cruz', role: 'admin', status: 'Active', lastLogin: '2026-03-06' },
    { id: 2, username: 'doctor1', fullname: 'Dr. James Cruz', role: 'doctor', status: 'Active', lastLogin: '2026-03-06' },
    { id: 3, username: 'doctor2', fullname: 'Dr. Maria Santos', role: 'doctor', status: 'Active', lastLogin: '2026-03-05' },
    { id: 4, username: 'nurse1', fullname: 'Anna Reyes', role: 'nurse', status: 'Active', lastLogin: '2026-03-06' },
    { id: 5, username: 'nurse2', fullname: 'Bea Gomez', role: 'nurse', status: 'Inactive', lastLogin: '2026-03-04' },
    { id: 6, username: 'staff1', fullname: 'Maria Santos', role: 'staff', status: 'Active', lastLogin: '2026-03-06' },
    { id: 7, username: 'staff2', fullname: 'Pedro Reyes', role: 'staff', status: 'Active', lastLogin: '2026-03-05' }
];

let archivedUsers = [];

const user = checkAuth(['admin']);
if (user) {
    document.getElementById('userName').textContent = user.name;
    loadAdminDashboard();
}

function loadAdminDashboard() {
    updateStats();
    renderUsers();
}

function updateStats() {
    document.getElementById('totalUsers').textContent = systemUsers.length;
    document.getElementById('totalDoctors').textContent = systemUsers.filter(u => u.role === 'doctor').length;
    document.getElementById('totalNurses').textContent = systemUsers.filter(u => u.role === 'nurse').length;
    document.getElementById('totalStaff').textContent = systemUsers.filter(u => u.role === 'staff').length;
}

function renderUsers() {
    const tbody = document.getElementById('usersList');
    tbody.innerHTML = systemUsers.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.fullname}</td>
            <td><span class="role-badge role-${user.role}">${user.role.toUpperCase()}</span></td>
            <td><span class="status-${user.status.toLowerCase()}">${user.status}</span></td>
            <td>
                <button class="btn-edit" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-archive" onclick="archiveUser(${user.id})"><i class="fas fa-archive"></i></button>
                <button class="btn-cancel" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openUserModal() {
    document.getElementById('modalTitle').textContent = 'Add New User';
    document.getElementById('userId').value = '';
    document.getElementById('username').value = '';
    document.getElementById('fullname').value = '';
    document.getElementById('role').value = 'staff';
    document.getElementById('status').value = 'Active';
    document.getElementById('userModal').classList.add('active');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
}

function saveUser() {
    const id = document.getElementById('userId').value;
    const username = document.getElementById('username').value;
    const fullname = document.getElementById('fullname').value;
    const role = document.getElementById('role').value;
    const status = document.getElementById('status').value;

    if (!username || !fullname) {
        showToast('Please fill all fields', 'error');
        return;
    }

    if (id) {
        const index = systemUsers.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            systemUsers[index] = { ...systemUsers[index], username, fullname, role, status };
            showToast('User updated successfully', 'success');
        }
    } else {
        const newUser = {
            id: systemUsers.length + 1,
            username,
            fullname,
            role,
            status,
            lastLogin: 'Never'
        };
        systemUsers.push(newUser);
        showToast('User added successfully', 'success');
    }

    updateStats();
    renderUsers();
    closeUserModal();
}

function editUser(id) {
    const user = systemUsers.find(u => u.id === id);
    if (user) {
        document.getElementById('modalTitle').textContent = 'Edit User';
        document.getElementById('userId').value = user.id;
        document.getElementById('username').value = user.username;
        document.getElementById('fullname').value = user.fullname;
        document.getElementById('role').value = user.role;
        document.getElementById('status').value = user.status;
        document.getElementById('userModal').classList.add('active');
    }
}

function archiveUser(id) {
    const user = systemUsers.find(u => u.id === id);
    if (user && confirm(`Archive user "${user.username}"?`)) {
        const index = systemUsers.findIndex(u => u.id === id);
        if (index !== -1) {
            const archivedUser = { ...user, archivedDate: new Date().toISOString().split('T')[0] };
            archivedUsers.push(archivedUser);
            systemUsers.splice(index, 1);
            updateStats();
            renderUsers();
            showToast(`User ${user.username} archived`, 'warning');
        }
    }
}

function deleteUser(id) {
    const user = systemUsers.find(u => u.id === id);
    if (user && confirm(`Permanently delete user "${user.username}"? This cannot be undone.`)) {
        const index = systemUsers.findIndex(u => u.id === id);
        if (index !== -1) {
            systemUsers.splice(index, 1);
            updateStats();
            renderUsers();
            showToast(`User ${user.username} deleted`, 'error');
        }
    }
}

function searchUsers() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = systemUsers.filter(u =>
        u.username.toLowerCase().includes(query) ||
        u.fullname.toLowerCase().includes(query)
    );

    const tbody = document.getElementById('usersList');
    tbody.innerHTML = filtered.map(user => `
        <tr>
            <td>${user.username}</td>
            <td>${user.fullname}</td>
            <td><span class="role-badge role-${user.role}">${user.role.toUpperCase()}</span></td>
            <td><span class="status-${user.status.toLowerCase()}">${user.status}</span></td>
            <td>
                <button class="btn-edit" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-archive" onclick="archiveUser(${user.id})"><i class="fas fa-archive"></i></button>
                <button class="btn-cancel" onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i></button>
             </td>
        </tr>
    `).join('');
}