package com.chatapp.chatapp.controller;

import com.chatapp.chatapp.dto.AuthResponse;
import com.chatapp.chatapp.dto.LoginRequest;
import com.chatapp.chatapp.dto.RegisterRequest;
import com.chatapp.chatapp.dto.UserResponse;
import com.chatapp.chatapp.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody RegisterRequest request) {

        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(userService.login(request));
    }
}