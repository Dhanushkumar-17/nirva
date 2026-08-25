package com.nirva.backend.controller;

import com.nirva.backend.entity.User;
import com.nirva.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already registered");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        User user =
                userRepository.findByEmail(loginUser.getEmail());

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        if (!user.getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid password");
        }

        return ResponseEntity.ok(user);
    }
}