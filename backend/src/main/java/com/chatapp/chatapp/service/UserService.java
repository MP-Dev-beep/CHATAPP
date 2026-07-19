package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.AuthResponse;
import com.chatapp.chatapp.dto.LoginRequest;
import com.chatapp.chatapp.dto.RegisterRequest;
import com.chatapp.chatapp.dto.UpdateProfileRequest;
import com.chatapp.chatapp.dto.UserResponse;

import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;



    // ==========================
    // INSCRIPTION
    // ==========================

    public UserResponse register(
            RegisterRequest request
    ) {


        if(userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email déjà utilisé"
            );

        }



        User user = User.builder()

                .firstname(request.getFirstname())

                .lastname(request.getLastname())

                .email(request.getEmail())

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .online(false)

                .build();



        User savedUser =
                userRepository.save(user);



        return UserResponse.builder()

                .id(savedUser.getId())

                .firstname(savedUser.getFirstname())

                .lastname(savedUser.getLastname())

                .email(savedUser.getEmail())

                .build();

    }






    // ==========================
    // LOGIN JWT
    // ==========================

    public AuthResponse login(
            LoginRequest request
    ) {


        System.out.println("======================");
        System.out.println("TENTATIVE CONNEXION");
        System.out.println("EMAIL : " + request.getEmail());
        System.out.println("======================");



        User user =
                userRepository.findByEmail(
                        request.getEmail()
                )

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );



        System.out.println(
                "UTILISATEUR TROUVE : "
                +
                user.getEmail()
        );


        System.out.println(
                "HASH EN BASE : "
                +
                user.getPassword()
        );



        boolean passwordCorrect =
                passwordEncoder.matches(

                        request.getPassword(),

                        user.getPassword()

                );



        System.out.println(
                "PASSWORD VALIDE : "
                +
                passwordCorrect
        );




        if(!passwordCorrect){


            throw new RuntimeException(
                    "Mot de passe incorrect"
            );


        }





        String token =
                jwtService.generateToken(
                        user.getEmail()
                );




        UserResponse response =
                UserResponse.builder()

                        .id(user.getId())

                        .firstname(user.getFirstname())

                        .lastname(user.getLastname())

                        .email(user.getEmail())

                        .build();





        return AuthResponse.builder()

                .token(token)

                .user(response)

                .build();


    }









    // ==========================
    // LISTE UTILISATEURS
    // ==========================


    public List<UserResponse> getAllUsers() {


        return userRepository.findAll()

                .stream()

                .map(user ->

                        UserResponse.builder()

                                .id(user.getId())

                                .firstname(user.getFirstname())

                                .lastname(user.getLastname())

                                .email(user.getEmail())

                                .build()

                )

                .collect(Collectors.toList());

    }









    // ==========================
    // RECHERCHE UTILISATEUR
    // ==========================


    public List<UserResponse> searchUsers(
            String keyword
    ) {


        return userRepository

                .findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
                        keyword,
                        keyword
                )

                .stream()

                .map(user ->

                        UserResponse.builder()

                                .id(user.getId())

                                .firstname(user.getFirstname())

                                .lastname(user.getLastname())

                                .email(user.getEmail())

                                .build()

                )

                .collect(Collectors.toList());

    }










    // ==========================
    // UPDATE PROFIL
    // ==========================


    public UserResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {


        User user =
                userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );



        if(request.getFirstname()!=null){

            user.setFirstname(
                    request.getFirstname()
            );

        }



        if(request.getLastname()!=null){

            user.setLastname(
                    request.getLastname()
            );

        }



        if(request.getAvatar()!=null){

            user.setAvatar(
                    request.getAvatar()
            );

        }



        User saved =
                userRepository.save(user);




        return UserResponse.builder()

                .id(saved.getId())

                .firstname(saved.getFirstname())

                .lastname(saved.getLastname())

                .email(saved.getEmail())

                .build();


    }


}