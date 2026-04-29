package com.healthdesk.service;

import com.healthdesk.dto.PatientDTO;
import com.healthdesk.model.Patient;
import com.healthdesk.model.User;
import com.healthdesk.repository.PatientRepository;
import com.healthdesk.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogService auditLogService;

    public PatientDTO createPatient(PatientDTO patientDTO, String userId) {
        Patient patient = new Patient();
        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setMiddleName(patientDTO.getMiddleName());
        patient.setAge(patientDTO.getAge());
        patient.setGender(patientDTO.getGender());
        patient.setEmail(patientDTO.getEmail());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        patient.setAddress(patientDTO.getAddress());
        patient.setMedicalHistory(patientDTO.getMedicalHistory());
        patient.setPreviousDiagnoses(patientDTO.getPreviousDiagnoses());
        patient.setBloodType(patientDTO.getBloodType());
        patient.setAllergies(patientDTO.getAllergies());
        patient.setCurrentMedications(patientDTO.getCurrentMedications());

        if (patientDTO.getAssignedDoctorId() != null) {
            User doctor = userRepository.findById(patientDTO.getAssignedDoctorId()).orElse(null);
            patient.setAssignedDoctor(doctor);
        }

        Patient saved = patientRepository.save(patient);
        auditLogService.logAction(userId, "CREATE_PATIENT", "Created patient: " + saved.getId());

        return convertToDTO(saved);
    }

    public List<PatientDTO> searchPatients(String searchTerm) {
        return patientRepository.searchByNameOrId(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PatientDTO getPatient(String id) {
        Patient patient = patientRepository.findById(id).orElse(null);
        return patient != null ? convertToDTO(patient) : null;
    }

    public void archivePatient(String id, String userId) {
        Patient patient = patientRepository.findById(id).orElse(null);
        if (patient != null) {
            patient.setArchived(true);
            patientRepository.save(patient);
            auditLogService.logAction(userId, "ARCHIVE_PATIENT", "Archived patient: " + id);
        }
    }

    private PatientDTO convertToDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setId(patient.getId());
        dto.setFirstName(patient.getFirstName());
        dto.setLastName(patient.getLastName());
        dto.setMiddleName(patient.getMiddleName());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());
        dto.setEmail(patient.getEmail());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setAddress(patient.getAddress());
        dto.setMedicalHistory(patient.getMedicalHistory());
        dto.setPreviousDiagnoses(patient.getPreviousDiagnoses());
        dto.setBloodType(patient.getBloodType());
        dto.setAllergies(patient.getAllergies());
        dto.setCurrentMedications(patient.getCurrentMedications());
        if (patient.getAssignedDoctor() != null) {
            dto.setAssignedDoctorId(patient.getAssignedDoctor().getId());
        }
        return dto;
    }
}