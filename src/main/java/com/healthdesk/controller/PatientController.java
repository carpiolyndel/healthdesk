package com.healthdesk.controller;

import com.healthdesk.dto.PatientDTO;
import com.healthdesk.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@Valid @RequestBody PatientDTO patientDTO,
                                                    @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(patientService.createPatient(patientDTO, userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PatientDTO>> searchPatients(@RequestParam String term) {
        return ResponseEntity.ok(patientService.searchPatients(term));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable String id) {
        PatientDTO patient = patientService.getPatient(id);
        return patient != null ? ResponseEntity.ok(patient) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/archive")
    public ResponseEntity<Void> archivePatient(@PathVariable String id,
                                               @RequestHeader("X-User-Id") String userId) {
        patientService.archivePatient(id, userId);
        return ResponseEntity.ok().build();
    }
}