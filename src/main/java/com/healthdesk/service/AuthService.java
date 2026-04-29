package com.healthdesk.service;

import com.healthdesk.dto.LoginRequestDTO;
import com.healthdesk.dto.LoginResponseDTO;
import com.healthdesk.model.RefreshToken;
import com.healthdesk.model.User;
import com.healthdesk.repository.RefreshTokenRepository;
import com.healthdesk.repository.UserRepository;
import com.healthdesk.security.JwtUtil;
import com.healthdesk.security.MfaProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MfaProvider mfaProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AuditLogService auditLogService;

    public LoginResponseDTO login(LoginRequestDTO loginRequest, String ipAddress) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (user.isMfaEnabled() && (loginRequest.getOtpCode() == null || loginRequest.getOtpCode().isEmpty())) {
            String otp = mfaProvider.generateOtp(user.getId());
            System.out.println("OTP for " + user.getEmail() + ": " + otp);
            return new LoginResponseDTO(null, null, "Bearer", user.getId(), user.getUsername(),
                    user.getRole().toString(), true);
        }

        if (user.isMfaEnabled() && !mfaProvider.validateOtp(user.getId(), loginRequest.getOtpCode())) {
            throw new RuntimeException("Invalid OTP");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = generateRefreshToken(user);

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        auditLogService.logAction(user.getId(), "LOGIN", "User logged in from IP: " + ipAddress);

        return new LoginResponseDTO(accessToken, refreshToken, "Bearer", user.getId(),
                user.getUsername(), user.getRole().toString(), false);
    }

    private String generateRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));

        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }
}