let doctorPatients = [
    { id: 'P001', name: 'Juan Dela Cruz', age: 45, diagnosis: 'Hypertension', history: 'High blood pressure since 2020. Previous medications include Amlodipine.', medications: 'Lisinopril 10mg once daily', lastVisit: '2026-03-01' },
    { id: 'P002', name: 'Maria Reyes', age: 32, diagnosis: 'Diabetes Type 2', history: 'Diagnosed with diabetes in 2022. Family history of diabetes.', medications: 'Metformin 500mg twice daily', lastVisit: '2026-03-02' },
    { id: 'P003', name: 'Pedro Santos', age: 28, diagnosis: 'Respiratory Infection', history: 'Recurrent respiratory issues. Smoker for 10 years.', medications: 'Amoxicillin 500mg three times daily', lastVisit: '2026-03-03' }
];

let stats = { patients: 3, today: 5, prescriptions: 12 };
let currentPatient = null;

const user = checkAuth(['doctor']);
if (user) {
    document.getElementById('userName').textContent = user.name;
    loadDoctorDashboard();
}

function loadDoctorDashboard() {
    updateStats();
    renderPatients();
}

function updateStats() {
    document.getElementById('patientCount').textContent = stats.patients;
    document.getElementById('todayCount').textContent = stats.today;
    document.getElementById('rxCount').textContent = stats.prescriptions;
}

function renderPatients() {
    const container = document.getElementById('patientsList');
    container.innerHTML = doctorPatients.map(p => `
        <div class="patient-card">
            <div class="patient-header">
                <span class="patient-name">${p.name}</span>
                <span class="patient-id">${p.id}</span>
            </div>
            <div class="diagnosis-badge">
                <i class="fas fa-stethoscope"></i> ${p.diagnosis}
            </div>
            <div class="medical-history-box">
                <p><strong>Medical History:</strong> ${p.history}</p>
                <p><strong>Current Medications:</strong> ${p.medications}</p>
                <p><strong>Last Visit:</strong> ${p.lastVisit}</p>
            </div>
            <button class="btn-update" onclick="openMedicalModal('${p.id}')">
                <i class="fas fa-edit"></i> Update Medical Record
            </button>
            <button class="btn-prescription" onclick="openPrescriptionModal('${p.id}')">
                <i class="fas fa-prescription"></i> Write Prescription
            </button>
        </div>
    `).join('');
}

function openMedicalModal(id) {
    currentPatient = doctorPatients.find(p => p.id === id);
    if (currentPatient) {
        document.getElementById('modalPatientId').value = currentPatient.id;
        document.getElementById('modalPatientName').value = currentPatient.name;
        document.getElementById('diagnosisInput').value = currentPatient.diagnosis;
        document.getElementById('historyInput').value = currentPatient.history;
        document.getElementById('medicationsInput').value = currentPatient.medications;
        document.getElementById('medicalModal').classList.add('active');
    }
}

function closeMedicalModal() {
    document.getElementById('medicalModal').classList.remove('active');
    currentPatient = null;
}

function saveMedicalRecord() {
    if (!currentPatient) return;

    const newDiagnosis = document.getElementById('diagnosisInput').value;
    const newHistory = document.getElementById('historyInput').value;
    const newMedications = document.getElementById('medicationsInput').value;

    if (newDiagnosis) currentPatient.diagnosis = newDiagnosis;
    if (newHistory) currentPatient.history = newHistory;
    if (newMedications) currentPatient.medications = newMedications;

    currentPatient.lastVisit = new Date().toISOString().split('T')[0];

    renderPatients();
    closeMedicalModal();
    showToast(`Medical record updated for ${currentPatient.name}`, 'success');
}

function openPrescriptionModal(id) {
    currentPatient = doctorPatients.find(p => p.id === id);
    if (currentPatient) {
        document.getElementById('rxPatientId').value = currentPatient.id;
        document.getElementById('rxPatientName').value = currentPatient.name;
        document.getElementById('medName').value = '';
        document.getElementById('dosage').value = '';
        document.getElementById('duration').value = '';
        document.getElementById('prescriptionModal').classList.add('active');
    }
}

function closePrescriptionModal() {
    document.getElementById('prescriptionModal').classList.remove('active');
    currentPatient = null;
}

function savePrescription() {
    if (!currentPatient) return;

    const medName = document.getElementById('medName').value;
    const dosage = document.getElementById('dosage').value;
    const duration = document.getElementById('duration').value;

    if (!medName || !dosage || !duration) {
        showToast('Please fill all prescription fields', 'error');
        return;
    }

    const prescription = `\n+ ${medName}: ${dosage} for ${duration}`;
    currentPatient.medications += prescription;
    stats.prescriptions++;

    updateStats();
    renderPatients();
    closePrescriptionModal();
    showToast(`Prescription written for ${currentPatient.name}`, 'success');
}

function searchPatients() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = doctorPatients.filter(p =>
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
            <div class="diagnosis-badge">
                <i class="fas fa-stethoscope"></i> ${p.diagnosis}
            </div>
            <div class="medical-history-box">
                <p><strong>Medical History:</strong> ${p.history}</p>
                <p><strong>Medications:</strong> ${p.medications}</p>
            </div>
            <button class="btn-update" onclick="openMedicalModal('${p.id}')">
                <i class="fas fa-edit"></i> Update Record
            </button>
            <button class="btn-prescription" onclick="openPrescriptionModal('${p.id}')">
                <i class="fas fa-prescription"></i> Prescription
            </button>
        </div>
    `).join('');
}