package com.healthdesk.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MfaProvider {

    @Value("${mfa.otp.length}")
    private int otpLength;

    @Value("${mfa.otp.expiration}")
    private long otpExpiration;

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateOtp(String userId) {
        String otp = generateRandomOtp();
        otpStore.put(userId, new OtpData(otp, LocalDateTime.now().plusNanos(otpExpiration * 1_000_000)));
        return otp;
    }

    public boolean validateOtp(String userId, String otp) {
        OtpData otpData = otpStore.get(userId);
        if (otpData == null) return false;
        if (otpData.expiry.isBefore(LocalDateTime.now())) {
            otpStore.remove(userId);
            return false;
        }
        if (otpData.otp.equals(otp)) {
            otpStore.remove(userId);
            return true;
        }
        return false;
    }

    private String generateRandomOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < otpLength; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }

    private static class OtpData {
        String otp;
        LocalDateTime expiry;

        OtpData(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }
}