package com.hlmd.fleetopt.service;

import com.hlmd.fleetopt.config.JwtService;
import com.hlmd.fleetopt.dto.AuthenticationRequest;
import com.hlmd.fleetopt.dto.AuthenticationResponse;
import com.hlmd.fleetopt.dto.RegisterRequest;
import com.hlmd.fleetopt.entity.DeliveryAgent;
import com.hlmd.fleetopt.entity.Role;
import com.hlmd.fleetopt.entity.User;
import com.hlmd.fleetopt.repository.DeliveryAgentRepository;
import com.hlmd.fleetopt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final DeliveryAgentRepository deliveryAgentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository repository,
            DeliveryAgentRepository deliveryAgentRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager
    ) {
        this.repository = repository;
        this.deliveryAgentRepository = deliveryAgentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        var savedUser = repository.save(user);

        // If user is a delivery boy, create an agent profile
        if (request.getRole() == Role.DELIVERY_BOY) {
            var agent = DeliveryAgent.builder()
                    .user(savedUser)
                    .name(request.getFirstName() + " " + request.getLastName())
                    .isAvailable(true)
                    .build();
            deliveryAgentRepository.save(agent);
        }

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();
    }
}
