package com.chatapp.chatapp.service;


import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class PresenceService {


    private final UserRepository userRepository;



    public void online(String email){


        userRepository.findByEmail(email)

                .ifPresent(user->{


                    user.setOnline(true);


                    userRepository.save(user);


                    System.out.println(
                            "USER ONLINE : "
                            +
                            email
                    );


                });


    }







    public void offline(String email){


        userRepository.findByEmail(email)

                .ifPresent(user->{


                    user.setOnline(false);


                    userRepository.save(user);


                    System.out.println(
                            "USER OFFLINE : "
                            +
                            email
                    );


                });



    }



}