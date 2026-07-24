package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.UserStatusResponse;
import com.chatapp.chatapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;



@Service
@RequiredArgsConstructor
public class PresenceService {



    private final UserRepository userRepository;


    private final SimpMessagingTemplate messagingTemplate;





    /*
    =====================================
    COMPTEUR DES CONNEXIONS WS
    email -> nombre de sessions
    =====================================
    */

    private final Map<String,Integer> onlineUsers =

            new ConcurrentHashMap<>();









    /*
    =====================================
    UTILISATEUR CONNECTE
    =====================================
    */

    public void online(String email){



        int count =

                onlineUsers.getOrDefault(
                        email,
                        0
                );



        count++;




        onlineUsers.put(

                email,

                count

        );







        /*
        Première connexion seulement
        */

        if(count == 1){



            userRepository.findByEmail(email)

                    .ifPresent(user->{



                        user.setOnline(true);


                        userRepository.save(user);






                        messagingTemplate.convertAndSend(

                                "/topic/users-status",

                                new UserStatusResponse(

                                        email,

                                        true

                                )

                        );





                        System.out.println(
                                "ONLINE : "
                                + email
                        );



                    });



        }






        System.out.println(

                "SESSION WS "

                + email

                + " = "

                + count

        );



    }









    /*
    =====================================
    UTILISATEUR DECONNECTE
    =====================================
    */

    public void offline(String email){



        int count =

                onlineUsers.getOrDefault(

                        email,

                        0

                );





        count--;







        /*
        Il reste une connexion
        */

        if(count > 0){



            onlineUsers.put(

                    email,

                    count

            );



            System.out.println(

                    "SESSION RESTANTE "

                    + email

                    + " = "

                    + count

            );



            return;


        }








        /*
        Dernière connexion fermée
        */

        onlineUsers.remove(email);







        userRepository.findByEmail(email)

                .ifPresent(user->{



                    user.setOnline(false);


                    userRepository.save(user);






                    messagingTemplate.convertAndSend(

                            "/topic/users-status",

                            new UserStatusResponse(

                                    email,

                                    false

                            )

                    );





                    System.out.println(

                            "OFFLINE : "

                            + email

                    );



                });



    }




}