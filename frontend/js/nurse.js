let patients = [
    { id: 'P001', name: 'Juan Dela Cruz', age: 45, diagnosis: 'Hypertension', bp: '130/85', temp: '36.5', weight: '70', hr: '78', lastVisit: '2026-03-01' },
    { id: 'P002', name: 'Maria Reyes', age: 32, diagnosis: 'Diabetes Type 2', bp: '120/80', temp: '36.8', weight: '65', hr: '72', lastVisit: '2026-03-02' },
    { id: 'P003', name: 'Pedro Santos', age: 28, diagnosis: 'Respiratory Infection', bp: '125/82', temp: '38.2', weight: '68', hr: '88', lastVisit: '2026-03-03' },
    { id: 'P004', name: 'Josefa Lopez', age: 60, diagnosis: 'Arthritis', bp: '140/90', temp: '36.5', weight: '72', hr: '75', lastVisit: '2026-03-04' },
    { id: 'P005', name: 'Andres Bonifacio', age: 35, diagnosis: 'Migraine', bp: '118/78', temp: '36.5', weight: '75', hr: '70', lastVisit: '2026-03-05' }
];

let stats = { assigned: 5, vitalsToday: 0, appointments: 8 };
let currentPatient = null;

const user = checkAuth(['nurse']);
if (user) {
    document.getElementById('userName').textContent = user.name;
    loadDashboard();
}

function loadDashboard() {
    updateStats();
    renderPatients();
}

function updateStats() {
    document.getElementById('assignedCount').textContent = stats.assigned;
    document.getElementById('vitalsToday').textContent = stats.vitalsToday;
    document.getElementById('todayAppointments').textContent = stats.appointments;
}

function renderPatients() {
    const container = document.getElementById('patientsList');
    container.innerHTML = patients.map(p => `
        <div class="patient-card">
            <div class="patient-header">
                <span class="patient-name">${p.name}</span>
                <span class="patient-id">${p.id}</span>
            </div>
            <div class="vitals-grid">
                <div class="vital-item">
                    <span class="vital-label">BP</span>
                    <span class="vital-value">${p.bp}</span>
                </div>
                <div class="vital-item">
                    <span class="vital-label">Temp</span>
                    <span class="vital-value">${p.temp}°C</span>
                </div>
                <div class="vital-item">
                    <span class="vital-label">Weight</span>
                    <span class="vital-value">${p.weight}kg</span>
                </div>
            </div>
            <div class="diagnosis">
                <i class="fas fa-stethoscope"></i> ${p.diagnosis}
            </div>
            <div class="diagnosis">
                <i class="fas fa-heartbeat"></i> Heart Rate: ${p.hr} bpm
            </div>
            <button class="btn-update" onclick="openVitalsModal('${p.id}')">
                <i class="fas fa-edit"></i> Update Vitals
            </button>
        </div>
    `).join('');
}

function openVitalsModal(id) {
    currentPatient = patients.find(p => p.id === id);
    if (currentPatient) {
        document.getElementById('modalPatientId').value = currentPatient.id;
        document.getElementById('modalPatientName').value = currentPatient.name;
        document.getElementById('bpInput').value = currentPatient.bp;
        document.getElementById('tempInput').value = currentPatient.temp;
        document.getElementById('weightInput').value = currentPatient.weight;
        document.getElementById('hrInput').value = currentPatient.hr;
        document.getElementById('vitalsModal').classList.add('active');
    }
}

function closeModal() {
    document.getElementById('vitalsModal').classList.remove('active');
    currentPatient = null;
}

function saveVitals() {
    if (!currentPatient) return;

    const newBP = document.getElementById('bpInput').value;
    const newTemp = document.getElementById('tempInput').value;
    const newWeight = document.getElementById('weightInput').value;
    const newHR = document.getElementById('hrInput').value;

    if (newBP) currentPatient.bp = newBP;
    if (newTemp) currentPatient.temp = newTemp;
    if (newWeight) currentPatient.weight = newWeight;
    if (newHR) currentPatient.hr = newHR;

    currentPatient.lastVisit = new Date().toISOString().split('T')[0];
    stats.vitalsToday++;

    updateStats();
    renderPatients();
    closeModal();
    showToast(`Vitals updated for ${currentPatient.name}`, 'success');
}

function searchPatients() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = patients.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query)
    );

    const container = document.getElementById('patientsList');
    container.innerHTML = filtered.map(p => `
        <div class="patient-card">
            <div class="patient-header">
                <span class="patient-name">${p.name}</span>
                <span class="patient-id">${p.id}</span>
            </div>
            <div class="vitals-grid">
                <div class="vital-item">
                    <span class="vital-label">BP</span>
                    <span class="vital-value">${p.bp}</span>
                </div>
                <div class="vital-item">
                    <span class="vital-label">Temp</span>
                    <span class="vital-value">${p.temp}°C</span>
                </div>
                <div class="vital-item">
                    <span class="vital-label">Weight</span>
                    <span class="vital-value">${p.weight}kg</span>
                </div>
            </div>
            <div class="diagnosis">
                <i class="fas fa-stethoscope"></i> ${p.diagnosis}
            </div>
            <button class="btn-update" onclick="openVitalsModal('${p.id}')">
                <i class="fas fa-edit"></i> Update Vitals
            </button>
        </div>
    `).join('');
}