package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;



    @PostMapping("/create-user")
    public User createUser(
            @RequestBody UserRequest request
    ){


        User user = User.builder()

                .firstname(request.firstname())

                .lastname(request.lastname())

                .email(request.email())

                // ICI LE MOT DE PASSE EST NORMAL
                // MAIS IL EST CRYPTE AVANT LA BASE
                .password(
                        passwordEncoder.encode(
                                request.password()
                        )
                )

                .online(false)

                .build();



        return userRepository.save(user);

    }



    public record UserRequest(
            String firstname,
            String lastname,
            String email,
            String password
    ){}

}