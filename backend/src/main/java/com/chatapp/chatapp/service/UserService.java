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









    // =====================================
    // INSCRIPTION
    // =====================================

    public AuthResponse register(
            RegisterRequest request
    ){



        if(userRepository.existsByEmail(request.getEmail())){


            throw new RuntimeException(
                    "Email déjà utilisé"
            );

        }







        User user = User.builder()

                .firstname(
                        request.getFirstname()
                )

                .lastname(
                        request.getLastname()
                )

                .email(
                        request.getEmail()
                )

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .avatar(null)


                /*
                ===============================
                IMPORTANT
                USER PAS ONLINE ICI
                ===============================
                */

                .online(false)

                .build();







        User saved =

                userRepository.save(user);







        String token =

                jwtService.generateToken(
                        saved.getEmail()
                );







        return AuthResponse.builder()

                .token(token)

                .user(convert(saved))

                .build();



    }













    // =====================================
    // LOGIN
    // =====================================

    public AuthResponse login(
            LoginRequest request
    ){



        User user =

                userRepository.findByEmail(
                        request.getEmail()
                )

                .orElseThrow(() ->

                        new RuntimeException(
                                "Utilisateur introuvable"
                        )

                );







        if(!passwordEncoder.matches(

                request.getPassword(),

                user.getPassword()

        )){



            throw new RuntimeException(
                    "Mot de passe incorrect"
            );


        }






        /*
        =====================================
        NE PAS METTRE ONLINE ICI
        =====================================

        Le statut online vient du WebSocket

        SessionConnectedEvent
                 |
                 |
        PresenceService.online()

        =====================================
        */







        String token =

                jwtService.generateToken(
                        user.getEmail()
                );








        return AuthResponse.builder()

                .token(token)

                .user(convert(user))

                .build();



    }












    // =====================================
    // TOUS LES UTILISATEURS
    // =====================================

    public List<UserResponse> getAllUsers(){



        return userRepository.findAll()

                .stream()

                .map(this::convert)

                .collect(Collectors.toList());


    }












    // =====================================
    // RECHERCHE
    // =====================================

    public List<UserResponse> searchUsers(
            String keyword
    ){



        return userRepository

                .findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(

                        keyword,

                        keyword

                )

                .stream()

                .map(this::convert)

                .collect(Collectors.toList());


    }












    // =====================================
    // USER PAR EMAIL
    // =====================================

    public UserResponse getUserByEmail(
            String email
    ){



        User user =

                userRepository.findByEmail(email)

                .orElseThrow(() ->

                        new RuntimeException(
                                "Utilisateur introuvable"
                        )

                );




        return convert(user);


    }












    // =====================================
    // UPDATE PROFIL
    // =====================================

    public UserResponse updateProfile(

            String email,

            UpdateProfileRequest request

    ){



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








        return convert(saved);



    }












    // =====================================
    // ENTITY -> DTO
    // =====================================

    private UserResponse convert(
            User user
    ){



        return UserResponse.builder()

                .id(
                        user.getId()
                )

                .firstname(
                        user.getFirstname()
                )

                .lastname(
                        user.getLastname()
                )

                .email(
                        user.getEmail()
                )

                .avatar(
                        user.getAvatar()
                )

                .online(
                        user.isOnline()
                )

                .build();



    }



}