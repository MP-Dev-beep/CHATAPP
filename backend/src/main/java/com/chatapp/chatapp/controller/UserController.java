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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;



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



    private static final String UPLOAD_DIR =
            System.getProperty("user.dir")
            + "/uploads/avatars/";








    @GetMapping("/test")
    public ResponseEntity<String> test(){

        return ResponseEntity.ok(
                "USER CONTROLLER OK"
        );

    }









    // =====================================
    // UTILISATEUR CONNECTE
    // GET /api/users/me
    // =====================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            Authentication authentication
    ){


        if(authentication == null){

            System.out.println(
                    "AUTHENTIFICATION NULL /me"
            );


            return ResponseEntity
                    .status(401)
                    .body("Non authentifié");

        }




        String email =
                authentication.getName();



        System.out.println(
                "USER CONNECTE : "
                + email
        );





        User user =

                userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );






        UserResponse response =

                UserResponse.builder()

                .id(user.getId())

                .firstname(user.getFirstname())

                .lastname(user.getLastname())

                .email(user.getEmail())

                .avatar(user.getAvatar())

                .online(user.isOnline())

                .build();





        return ResponseEntity.ok(response);


    }









    // =====================================
    // TOUS LES UTILISATEURS
    // =====================================

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers(){



        System.out.println(
                "GET USERS APPELE"
        );



        return ResponseEntity.ok(

                userService.getAllUsers()

        );


    }









    // =====================================
    // RECHERCHE
    // =====================================

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(

            @RequestParam String keyword

    ){


        return ResponseEntity.ok(

                userService.searchUsers(keyword)

        );


    }









    // =====================================
    // UPDATE PROFIL
    // =====================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(

            Authentication authentication,

            @RequestBody UpdateProfileRequest request

    ){



        if(authentication == null){

            return ResponseEntity
                    .status(401)
                    .body("Non authentifié");

        }




        String email =

                authentication.getName();




        return ResponseEntity.ok(

                userService.updateProfile(

                        email,

                        request

                )

        );


    }









    // =====================================
    // UPLOAD AVATAR
    // =====================================

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(

            Authentication authentication,

            @RequestParam("file")
            MultipartFile file

    ) throws IOException {



        if(authentication == null){

            return ResponseEntity
                    .status(401)
                    .body("Non authentifié");

        }





        String email =

                authentication.getName();





        User user =

                userRepository.findByEmail(email)

                .orElseThrow(() ->

                        new RuntimeException(
                                "Utilisateur introuvable"
                        )

                );






        Files.createDirectories(

                Paths.get(UPLOAD_DIR)

        );






        String originalName =

                file.getOriginalFilename();




        String extension = "";



        if(originalName != null &&
                originalName.contains(".")){


            extension =
                    originalName.substring(
                            originalName.lastIndexOf(".")
                    );

        }







        String filename =

                UUID.randomUUID()
                +
                extension;







        Path destination =

                Paths.get(

                        UPLOAD_DIR,

                        filename

                );






        Files.copy(

                file.getInputStream(),

                destination,

                StandardCopyOption.REPLACE_EXISTING

        );






        user.setAvatar(

                "/uploads/avatars/"
                +
                filename

        );






        User saved =

                userRepository.save(user);






        UserResponse response =

                UserResponse.builder()

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