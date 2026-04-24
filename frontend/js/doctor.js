let doctorPatients = [
    { id: 'P001', name: 'Carpio, Lyndel J.', age: 22, diagnosis: 'Hypertension', history: 'Family history of high blood pressure. Diagnosed during annual checkup.', medications: 'Lisinopril 10mg once daily', allergies: 'None', lastVisit: new Date().toISOString().split('T')[0] },
    { id: 'P002', name: 'Balanquit, Junel M.', age: 23, diagnosis: 'Diabetes Type 2', history: 'Diagnosed 2024 due to elevated blood sugar. Family history of diabetes.', medications: 'Metformin 500mg twice daily', allergies: 'Penicillin', lastVisit: new Date().toISOString().split('T')[0] },
    { id: 'P003', name: 'Balansag, Geraldine R.', age: 22, diagnosis: 'Respiratory Infection', history: 'Recurrent respiratory issues. Non-smoker.', medications: 'Amoxicillin 500mg three times daily', allergies: 'None', lastVisit: new Date().toISOString().split('T')[0] },
    { id: 'P004', name: 'Colele, Shella Mae E.', age: 23, diagnosis: 'Anemia', history: 'Iron deficiency. Low hemoglobin levels.', medications: 'Ferrous Sulfate 325mg once daily', allergies: 'None', lastVisit: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
    { id: 'P005', name: 'Senobio, Denzel', age: 22, diagnosis: 'Migraine', history: 'Frequent headaches triggered by stress and lack of sleep.', medications: 'Ibuprofen 400mg as needed', allergies: 'NSAIDs', lastVisit: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
    { id: 'P006', name: 'Dizon, Judy Marie A.', age: 23, diagnosis: 'Allergic Rhinitis', history: 'Seasonal allergies. Sensitive to dust and pollen.', medications: 'Loratadine 10mg once daily', allergies: 'Pollen', lastVisit: new Date(Date.now() - 172800000).toISOString().split('T')[0] }
];

let stats = { patients: 6, today: 6, prescriptions: 8 };
let currentPatient = null;

function updateStats() {
    const patientCount = document.getElementById('patientCount');
    const todayCount = document.getElementById('todayCount');
    const rxCount = document.getElementById('rxCount');
    
    if (patientCount) patientCount.textContent = stats.patients;
    if (todayCount) todayCount.textContent = stats.today;
    if (rxCount) rxCount.textContent = stats.prescriptions;
}

function renderPatients(list = doctorPatients) {
    const container = document.getElementById('patientsList');
    if (!container) return;
    
    if (list.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;">No patients found</p>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < list.length; i++) {
        const p = list[i];
        html += `
            <div class="patient-card" style="background:white;border-radius:12px;padding:20px;border:1px solid #e2e8f0;margin-bottom:16px;transition:all 0.3s;">
                <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
                    <span style="font-size:18px;font-weight:700;color:#0f172a;">${escapeHtml(p.name)}</span>
                    <span style="background:#f1f5f9;padding:4px 10px;border-radius:20px;font-size:12px;color:#64748b;">${p.id}</span>
                </div>
                <div style="background:#ccfbf1;display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;margin:8px 0;">
                    <i class="fas fa-stethoscope" style="color:#0d9488;"></i> ${escapeHtml(p.diagnosis)}
                </div>
                <div style="background:#f1f5f9;padding:12px;border-radius:12px;margin:12px 0;">
                    <p style="margin:4px 0;"><strong>📋 History:</strong> ${escapeHtml(p.history)}</p>
                    <p style="margin:4px 0;"><strong>💊 Medications:</strong> ${escapeHtml(p.medications)}</p>
                    <p style="margin:4px 0;"><strong>⚠️ Allergies:</strong> ${escapeHtml(p.allergies)}</p>
                    <p style="margin:4px 0;"><strong>📅 Last Visit:</strong> ${p.lastVisit}</p>
                </div>
                <button class="btn-primary" style="width:100%;margin-top:8px;" onclick="openMedicalModal('${p.id}')">Update Medical Record</button>
                <button class="btn-primary" style="width:100%;margin-top:8px;background:#10b981;" onclick="openPrescriptionModal('${p.id}')">Write Prescription</button>
            </div>
        `;
    }
    container.innerHTML = html;
}

function openMedicalModal(id) {
    currentPatient = doctorPatients.find(p => p.id === id);
    if (currentPatient) {
        document.getElementById('modalPatientId').value = currentPatient.id;
        document.getElementById('medicalPatientName').value = currentPatient.name;
        document.getElementById('diagnosisInput').value = currentPatient.diagnosis;
        document.getElementById('historyInput').value = currentPatient.history;
        document.getElementById('medicationsInput').value = currentPatient.medications;
        document.getElementById('allergiesInput').value = currentPatient.allergies;
        document.getElementById('medicalModal').classList.add('active');
    }
}

function closeMedicalModal() {
    document.getElementById('medicalModal').classList.remove('active');
    currentPatient = null;
}

function saveMedicalRecord() {
    if (!currentPatient) return;
    
    const diagnosisInput = document.getElementById('diagnosisInput');
    const historyInput = document.getElementById('historyInput');
    const medicationsInput = document.getElementById('medicationsInput');
    const allergiesInput = document.getElementById('allergiesInput');
    
    if (diagnosisInput) currentPatient.diagnosis = diagnosisInput.value;
    if (historyInput) currentPatient.history = historyInput.value;
    if (medicationsInput) currentPatient.medications = medicationsInput.value;
    if (allergiesInput) currentPatient.allergies = allergiesInput.value;
    
    currentPatient.lastVisit = new Date().toISOString().split('T')[0];
    renderPatients();
    closeMedicalModal();
    showToast('Medical record updated for ' + currentPatient.name, 'success');
}

function openPrescriptionModal(id) {
    currentPatient = doctorPatients.find(p => p.id === id);
    if (currentPatient) {
        document.getElementById('rxPatientId').value = currentPatient.id;
        document.getElementById('rxPatientName').value = currentPatient.name;
        document.getElementById('prescriptionModal').classList.add('active');
    }
}

function closePrescriptionModal() {
    document.getElementById('prescriptionModal').classList.remove('active');
    document.getElementById('prescriptionForm').reset();
    currentPatient = null;
}

function savePrescription() {
    if (!currentPatient) return;
    
    const medName = document.getElementById('medName');
    const dosage = document.getElementById('dosage');
    const duration = document.getElementById('duration');
    const instructions = document.getElementById('instructions');
    
    if (!medName || !medName.value) {
        showToast('Enter medication name', 'error');
        return;
    }
    
    let prescription = `\n+ ${medName.value}`;
    if (dosage && dosage.value) prescription += `: ${dosage.value}`;
    if (duration && duration.value) prescription += ` for ${duration.value}`;
    if (instructions && instructions.value) prescription += ` (${instructions.value})`;
    
    currentPatient.medications += prescription;
    stats.prescriptions++;
    
    updateStats();
    renderPatients();
    closePrescriptionModal();
    showToast('Prescription written for ' + currentPatient.name, 'success');
}

function searchPatients() {
    const queryInput = document.getElementById('searchPatientsInput');
    const query = queryInput ? queryInput.value.toLowerCase() : '';
    
    if (!query) {
        renderPatients();
        return;
    }
    
    const filtered = doctorPatients.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.id.toLowerCase().includes(query)
    );
    renderPatients(filtered);
}

function generateDiagnosisReport() {
    const reportDiv = document.getElementById('reportResult');
    if (!reportDiv) return;
    
    const diagnosisCount = {};
    for (let i = 0; i < doctorPatients.length; i++) {
        const diag = doctorPatients[i].diagnosis;
        diagnosisCount[diag] = (diagnosisCount[diag] || 0) + 1;
    }
    
    reportDiv.innerHTML = `
        <div style="background:white;border-radius:16px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="border-bottom:2px solid #e2e8f0;padding-bottom:16px;margin-bottom:20px;">
                <h3 style="color:#0f172a;font-size:20px;margin:0;display:flex;align-items:center;gap:10px;">
                    <i class="fas fa-stethoscope" style="color:#0d9488;"></i> Diagnosis Summary Report
                </h3>
                <p style="color:#64748b;font-size:13px;margin:8px 0 0;">Generated on ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
                <div style="background:#f1f5f9;border-radius:12px;padding:16px;text-align:center;">
                    <span style="font-size:28px;font-weight:700;color:#0d9488;">${doctorPatients.length}</span>
                    <p style="font-size:12px;color:#64748b;margin:4px 0 0;">Total Patients</p>
                </div>
                <div style="background:#f1f5f9;border-radius:12px;padding:16px;text-align:center;">
                    <span style="font-size:28px;font-weight:700;color:#0d9488;">${Object.keys(diagnosisCount).length}</span>
                    <p style="font-size:12px;color:#64748b;margin:4px 0 0;">Unique Diagnoses</p>
                </div>
                <div style="background:#f1f5f9;border-radius:12px;padding:16px;text-align:center;">
                    <span style="font-size:28px;font-weight:700;color:#0d9488;">${stats.prescriptions}</span>
                    <p style="font-size:12px;color:#64748b;margin:4px 0 0;">Total Prescriptions</p>
                </div>
            </div>
            
            <div style="margin-bottom:24px;">
                <h4 style="color:#0f172a;font-size:16px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <i class="fas fa-chart-pie" style="color:#0d9488;"></i> Diagnosis Distribution
                </h4>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">
                    ${Object.entries(diagnosisCount).map(([diag, count]) => `
                        <div style="background:#f8fafc;border-radius:10px;padding:12px;display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-weight:500;">${diag}</span>
                            <span style="background:#0d9488;color:white;padding:2px 10px;border-radius:20px;font-size:12px;">${count} patient(s)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div>
                <h4 style="color:#0f172a;font-size:16px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <i class="fas fa-list" style="color:#0d9488;"></i> Detailed Patient Diagnosis
                </h4>
                <div style="overflow-x:auto;">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f1f5f9;">
                                <th style="padding:12px;text-align:left;font-size:13px;">Patient ID</th>
                                <th style="padding:12px;text-align:left;font-size:13px;">Name</th>
                                <th style="padding:12px;text-align:left;font-size:13px;">Diagnosis</th>
                                <th style="padding:12px;text-align:left;font-size:13px;">Medications</th>
                                <th style="padding:12px;text-align:left;font-size:13px;">Last Visit</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${doctorPatients.map(p => `
                                <tr style="border-bottom:1px solid #e2e8f0;">
                                    <td style="padding:12px;font-size:13px;">${p.id}</td>
                                    <td style="padding:12px;font-size:13px;font-weight:500;">${p.name}</td>
                                    <td style="padding:12px;font-size:13px;"><span style="background:#ccfbf1;padding:2px 8px;border-radius:20px;">${p.diagnosis}</span></td>
                                    <td style="padding:12px;font-size:13px;">${p.medications.substring(0, 50)}...</td>
                                    <td style="padding:12px;font-size:13px;">${p.lastVisit}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
                <button class="btn-primary" onclick="exportDiagnosisReport()" style="padding:8px 20px;">
                    <i class="fas fa-download"></i> Export Report
                </button>
            </div>
        </div>
    `;
}

function generateMedicationReport() {
    const reportDiv = document.getElementById('reportResult');
    if (!reportDiv) return;
    
    reportDiv.innerHTML = `
        <div style="background:white;border-radius:16px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            <div style="border-bottom:2px solid #e2e8f0;padding-bottom:16px;margin-bottom:20px;">
                <h3 style="color:#0f172a;font-size:20px;margin:0;display:flex;align-items:center;gap:10px;">
                    <i class="fas fa-prescription" style="color:#0d9488;"></i> Medication Report
                </h3>
                <p style="color:#64748b;font-size:13px;margin:8px 0 0;">Generated on ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px;">
                <div style="background:#f1f5f9;border-radius:12px;padding:16px;text-align:center;">
                    <span style="font-size:28px;font-weight:700;color:#0d9488;">${stats.prescriptions}</span>
                    <p style="font-size:12px;color:#64748b;margin:4px 0 0;">Total Prescriptions</p>
                </div>
                <div style="background:#f1f5f9;border-radius:12px;padding:16px;text-align:center;">
                    <span style="font-size:28px;font-weight:700;color:#0d9488;">${doctorPatients.length}</span>
                    <p style="font-size:12px;color:#64748b;margin:4px 0 0;">Active Patients</p>
                </div>
                <div style="background:#f1f5f9;border-radius:12px;padding:16px;text-align:center;">
                    <span style="font-size:28px;font-weight:700;color:#0d9488;">${doctorPatients.filter(p => p.medications.includes('+')).length}</span>
                    <p style="font-size:12px;color:#64748b;margin:4px 0 0;">Multiple Meds</p>
                </div>
            </div>
            
            <div>
                <h4 style="color:#0f172a;font-size:16px;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
                    <i class="fas fa-capsules" style="color:#0d9488;"></i> Patient Medications
                </h4>
                ${doctorPatients.map(p => `
                    <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:12px;border-left:3px solid #0d9488;">
                        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;margin-bottom:8px;">
                            <strong style="color:#0f172a;">${p.id} - ${p.name}</strong>
                            <span style="background:#e2e8f0;padding:2px 8px;border-radius:20px;font-size:11px;">${p.diagnosis}</span>
                        </div>
                        <div style="margin-top:8px;">
                            <p style="margin:4px 0;"><strong>💊 Current Medications:</strong></p>
                            <p style="margin:4px 0;font-size:14px;color:#334155;">${escapeHtml(p.medications)}</p>
                            <p style="margin:8px 0 0;"><strong>⚠️ Allergies:</strong> ${escapeHtml(p.allergies)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;">
                <button class="btn-primary" onclick="exportMedicationReport()" style="padding:8px 20px;">
                    <i class="fas fa-download"></i> Export Report
                </button>
            </div>
        </div>
    `;
}

function exportDiagnosisReport() {
    const data = doctorPatients.map(p => ({
        'Patient ID': p.id,
        'Name': p.name,
        'Age': p.age,
        'Diagnosis': p.diagnosis,
        'Medications': p.medications,
        'Allergies': p.allergies,
        'Last Visit': p.lastVisit
    }));
    downloadCSV(data, 'diagnosis_report');
}

function exportMedicationReport() {
    const data = doctorPatients.map(p => ({
        'Patient ID': p.id,
        'Name': p.name,
        'Diagnosis': p.diagnosis,
        'Medications': p.medications,
        'Allergies': p.allergies,
        'Last Visit': p.lastVisit
    }));
    downloadCSV(data, 'medication_report');
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'DOCTOR') {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (user) {
        const userNameSpan = document.getElementById('userName');
        if (userNameSpan) userNameSpan.textContent = user.name;
    }
    
    updateStats();
    renderPatients();
    
    const sidebarSearch = document.getElementById('sidebarSearch');
    if (sidebarSearch) {
        sidebarSearch.addEventListener('input', function(e) {
            const q = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.nav-item[data-page]');
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.getAttribute('data-page') === 'dashboard') continue;
                if (item.innerText.toLowerCase().includes(q)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.toggle('active');
        });
    }
    
    const searchInput = document.getElementById('searchPatientsInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchPatients();
        });
    }
    
    const navItems = document.querySelectorAll('.nav-item');
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            for (let j = 0; j < navItems.length; j++) {
                navItems[j].classList.remove('active');
            }
            this.classList.add('active');
            
            const dashboardPage = document.getElementById('dashboardPage');
            const patientsPage = document.getElementById('patientsPage');
            const reportsPage = document.getElementById('reportsPage');
            const pageTitle = document.getElementById('pageTitle');
            
            if (dashboardPage) dashboardPage.style.display = 'none';
            if (patientsPage) patientsPage.style.display = 'none';
            if (reportsPage) reportsPage.style.display = 'none';
            
            if (page === 'dashboard' && dashboardPage) dashboardPage.style.display = 'block';
            if (page === 'patients' && patientsPage) patientsPage.style.display = 'block';
            if (page === 'reports' && reportsPage) reportsPage.style.display = 'block';
            
            if (pageTitle) {
                if (page === 'dashboard') pageTitle.innerText = 'Doctor Dashboard';
                else if (page === 'patients') pageTitle.innerText = 'My Patients';
                else if (page === 'reports') pageTitle.innerText = 'Medical Reports';
            }
            
            if (page === 'patients') renderPatients();
        });
    }
});

window.openMedicalModal = openMedicalModal;
window.closeMedicalModal = closeMedicalModal;
window.openPrescriptionModal = openPrescriptionModal;
window.closePrescriptionModal = closePrescriptionModal;
window.searchPatients = searchPatients;
window.generateDiagnosisReport = generateDiagnosisReport;
window.generateMedicationReport = generateMedicationReport;
window.exportDiagnosisReport = exportDiagnosisReport;
window.exportMedicationReport = exportMedicationReport;
window.logout = logout;