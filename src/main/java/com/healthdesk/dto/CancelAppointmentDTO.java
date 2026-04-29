package com.healthdesk.dto;

import jakarta.validation.constraints.NotBlank;

public class CancelAppointmentDTO {
    @NotBlank(message = "Cancellation reason is required")
    private String cancellationReason;

    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
}