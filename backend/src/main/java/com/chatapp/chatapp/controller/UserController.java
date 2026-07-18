package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.UpdateProfileRequest;
import com.chatapp.chatapp.dto.UserResponse;
import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.UserRepository;
import com.chatapp.chatapp.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UserController {


    private final UserRepository userRepository;

    private final UserService userService;



    // ==========================
    // UTILISATEUR CONNECTE
    // ==========================

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            Authentication authentication
    ) {


        String email = authentication.getName();


        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );


        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .build();


        return ResponseEntity.ok(response);

    }




    // ==========================
    // LISTE DES UTILISATEURS
    // ==========================

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {


        return ResponseEntity.ok(
                userService.getAllUsers()
        );

    }




    // ==========================
    // RECHERCHE UTILISATEUR
    // ==========================

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(
            @RequestParam String keyword
    ) {


        return ResponseEntity.ok(
                userService.searchUsers(keyword)
        );

    }




    // ==========================
    // MODIFICATION PROFIL
    // ==========================

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {


        String email = authentication.getName();


        return ResponseEntity.ok(
                userService.updateProfile(
                        email,
                        request
                )
        );

    }


}