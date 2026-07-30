package com.chatapp.chatapp.controller;

import com.chatapp.chatapp.dto.UpdateProfileRequest;
import com.chatapp.chatapp.dto.UserResponse;
import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.UserRepository;
import com.chatapp.chatapp.service.FileStorageService;
import com.chatapp.chatapp.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService; // Injection du service de stockage

    @GetMapping("/test")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("USER CONTROLLER OK");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication){
        if(authentication == null){
            return ResponseEntity.status(401).body("Non authentifié");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .online(user.isOnline())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String keyword){
        return ResponseEntity.ok(userService.searchUsers(keyword));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ){
        if(authentication == null){
            return ResponseEntity.status(401).body("Non authentifié");
        }

        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) {
        if(authentication == null){
            return ResponseEntity.status(401).body("Non authentifié");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Utilisation de votre service de fichiers existant
        String fileUri = fileStorageService.storeFile(file); // Renvoie ex: "/uploads/uuid.png"
        
        user.setAvatar(fileUri);
        User saved = userRepository.save(user);

        UserResponse response = UserResponse.builder()
                .id(saved.getId())
                .firstname(saved.getFirstname())
                .lastname(saved.getLastname())
                .email(saved.getEmail())
                .avatar(saved.getAvatar())
                .online(saved.isOnline())
                .build();

        return ResponseEntity.ok(response);
    }
}