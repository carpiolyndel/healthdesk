package main.java.com.healthdesk.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vitals {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(name = "patient_id", nullable = false, length = 10)
    private String patientId;
    
    @Column(length = 20)
    private String bp;
    
    @Column(length = 10)
    private String temp;
    
    @Column(length = 10)
    private String weight;
    
    @Column(length = 10)
    private String hr;
    
    @Column(name = "last_updated")
    private LocalDate lastUpdated;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastUpdated = LocalDate.now();
    }
}