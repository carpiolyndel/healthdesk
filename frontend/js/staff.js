let appointments = [
    { id: 1, time: '09:00 AM', patient: 'Juan Dela Cruz', doctor: 'Dr. Santos', status: 'scheduled', date: '2026-03-10' },
    { id: 2, time: '10:30 AM', patient: 'Maria Reyes', doctor: 'Dr. Cruz', status: 'scheduled', date: '2026-03-10' },
    { id: 3, time: '01:00 PM', patient: 'Pedro Santos', doctor: 'Dr. Lopez', status: 'scheduled', date: '2026-03-10' },
    { id: 4, time: '02:30 PM', patient: 'Josefa Lopez', doctor: 'Dr. Santos', status: 'scheduled', date: '2026-03-11' },
    { id: 5, time: '03:00 PM', patient: 'Andres Bonifacio', doctor: 'Dr. Cruz', status: 'scheduled', date: '2026-03-11' }
];

let bookedSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '03:00 PM'];
let stats = { today: 3, week: 5, patients: 156, slots: 7 };

const user = checkAuth(['staff']);
if (user) {
    document.getElementById('userName').textContent = user.name;
    loadDashboard();
}

function loadDashboard() {
    updateStats();
    renderAppointments();
}

function updateStats() {
    document.getElementById('todayCount').textContent = stats.today;
    document.getElementById('weekCount').textContent = stats.week;
    document.getElementById('patientCount').textContent = stats.patients;
    document.getElementById('slotCount').textContent = stats.slots;
}

function renderAppointments() {
    const tbody = document.getElementById('appointmentsList');
    tbody.innerHTML = appointments.map(app => `
        <tr>
            <td>${app.time}</td>
            <td><strong>${app.patient}</strong></td>
            <td>${app.doctor}</td>
            <td><span class="status status-scheduled">${app.status}</span></td>
            <td>
                <button class="btn-edit" onclick="editAppointment(${app.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-cancel" onclick="cancelAppointment(${app.id})"><i class="fas fa-trash"></i> Cancel</button>
            </td>
        </tr>
    `).join('');
}

function openScheduleModal() {
    const patient = prompt('Enter patient name:');
    if (!patient) return;

    const doctor = prompt('Select doctor (Dr. Santos / Dr. Cruz / Dr. Lopez):');
    if (!doctor) return;

    const time = prompt('Enter time (e.g., 09:00 AM, 10:30 AM):');
    if (!time) return;

    if (bookedSlots.includes(time)) {
        showToast('Time slot already booked. Please choose another time.', 'error');
        return;
    }

    const date = prompt('Enter date (YYYY-MM-DD):');
    if (!date) return;

    const validation = validateAppointmentDate(date);
    if (!validation.valid) {
        showToast(validation.message, 'error');
        return;
    }

    const newAppointment = {
        id: appointments.length + 1,
        time: time,
        patient: patient,
        doctor: doctor,
        status: 'scheduled',
        date: date
    };

    appointments.push(newAppointment);
    bookedSlots.push(time);
    stats.today++;
    stats.week++;
    stats.slots--;

    updateStats();
    renderAppointments();
    showToast(`Appointment scheduled for ${patient} on ${date} at ${time}`, 'success');
}

function editAppointment(id) {
    const app = appointments.find(a => a.id === id);
    if (!app) return;

    const newTime = prompt('Edit time:', app.time);
    if (newTime && !bookedSlots.includes(newTime)) {
        const oldSlotIndex = bookedSlots.indexOf(app.time);
        if (oldSlotIndex !== -1) bookedSlots.splice(oldSlotIndex, 1);
        app.time = newTime;
        bookedSlots.push(newTime);
        renderAppointments();
        showToast('Appointment updated successfully', 'success');
    } else if (newTime && bookedSlots.includes(newTime)) {
        showToast('Time slot already taken', 'error');
    }
}

function cancelAppointment(id) {
    const app = appointments.find(a => a.id === id);
    if (!app) return;

    if (!checkCancellationRule(app.date)) {
        showToast('Appointments can only be cancelled at least 1 day before', 'error');
        return;
    }

    const reason = prompt('Reason for cancellation:');
    if (!reason) return;

    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
        appointments.splice(index, 1);
        const slotIndex = bookedSlots.indexOf(app.time);
        if (slotIndex !== -1) bookedSlots.splice(slotIndex, 1);

        if (new Date(app.date).toDateString() === new Date().toDateString()) {
            stats.today--;
        }
        stats.week--;
        stats.slots++;

        updateStats();
        renderAppointments();
        showToast(`Appointment cancelled. Reason: ${reason}`, 'warning');
    }
}

function searchAppointments() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = appointments.filter(app =>
        app.patient.toLowerCase().includes(query) ||
        app.doctor.toLowerCase().includes(query)
    );

    const tbody = document.getElementById('appointmentsList');
    tbody.innerHTML = filtered.map(app => `
        <tr>
            <td>${app.time}</td>
            <td><strong>${app.patient}</strong></td>
            <td>${app.doctor}</td>
            <td><span class="status status-scheduled">${app.status}</span></td>
            <td>
                <button class="btn-edit" onclick="editAppointment(${app.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn-cancel" onclick="cancelAppointment(${app.id})"><i class="fas fa-trash"></i> Cancel</button>
            </td>
        </tr>
    `).join('');
}