package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.UserStatusResponse;
import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.UserRepository;


import lombok.RequiredArgsConstructor;


import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


import java.util.Optional;



@Service
@RequiredArgsConstructor
public class PresenceService {



    private final UserRepository userRepository;


    private final SimpMessagingTemplate messagingTemplate;








    /*
    =====================================
    USER ONLINE
    =====================================
    */


    public void online(
            String email
    ){



        System.out.println(
                "TRY ONLINE : "
                +
                email
        );






        Optional<User> optionalUser =

                userRepository.findByEmail(
                        email
                );







        if(optionalUser.isPresent()){



            User user = optionalUser.get();





            if(!user.isOnline()){



                user.setOnline(true);


                userRepository.save(
                        user
                );


            }







            UserStatusResponse response =


                    new UserStatusResponse(

                            user.getEmail(),

                            true

                    );







            messagingTemplate.convertAndSend(

                    "/topic/users-status",

                    response

            );








            System.out.println(
                    "ONLINE BROADCAST : "
                    +
                    email
            );





        }

        else{


            System.out.println(
                    "USER INTROUVABLE : "
                    +
                    email
            );


        }



    }













    /*
    =====================================
    USER OFFLINE
    =====================================
    */


    public void offline(
            String email
    ){





        System.out.println(
                "TRY OFFLINE : "
                +
                email
        );








        Optional<User> optionalUser =

                userRepository.findByEmail(
                        email
                );







        if(optionalUser.isPresent()){



            User user = optionalUser.get();





            user.setOnline(false);





            userRepository.save(
                    user
            );









            UserStatusResponse response =


                    new UserStatusResponse(

                            user.getEmail(),

                            false

                    );







            messagingTemplate.convertAndSend(

                    "/topic/users-status",

                    response

            );








            System.out.println(
                    "OFFLINE BROADCAST : "
                    +
                    email
            );





        }

        else{


            System.out.println(
                    "USER INTROUVABLE : "
                    +
                    email
            );


        }



    }


        /*
    =====================================
    VERIFIER SI USER EST ONLINE
    =====================================
    */

    public boolean isOnline(
            String email
    ){

        return userRepository.findByEmail(email)

                .map(User::isOnline)

                .orElse(false);

    }



}