package main.java.com.healthdesk.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.healthdesk.model.enums.AppointmentStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "patient_id", nullable = false, length = 10)
    private String patientId;
    
    @Column(name = "doctor_id", nullable = false)
    private Integer doctorId;
    
    @Column(name = "nurse_id")
    private Integer nurseId;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(nullable = false, length = 20)
    private String time;
    
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.scheduled;
    
    private String reason;
    
    @Column(name = "cancellation_reason")
    private String cancellationReason;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}