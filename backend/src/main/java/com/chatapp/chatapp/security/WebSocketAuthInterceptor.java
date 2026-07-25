package com.chatapp.chatapp.security;


import com.chatapp.chatapp.service.JwtService;

import lombok.RequiredArgsConstructor;


import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;

import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.stereotype.Component;


import java.util.Collections;



@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {



    private final JwtService jwtService;






    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ){



        StompHeaderAccessor accessor =

                MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );





        if(accessor == null){

            return message;

        }






        /*
        ===================================
        AUTHENTIFICATION UNIQUEMENT CONNECT
        ===================================
        */


        if(StompCommand.CONNECT.equals(
                accessor.getCommand()
        )){



            String authorization =

                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );





            System.out.println(
                    "========== WS CONNECT =========="
            );


            System.out.println(
                    "TOKEN : "
                    +
                    authorization
            );






            if(authorization != null &&

                    authorization.startsWith("Bearer ")

            ){



                try {



                    String token =

                            authorization.substring(7);






                    String email =

                            jwtService.extractEmail(
                                    token
                            );







                    UsernamePasswordAuthenticationToken authentication =


                            new UsernamePasswordAuthenticationToken(

                                    email,

                                    null,

                                    Collections.emptyList()

                            );







                    accessor.setUser(
                            authentication
                    );







                    System.out.println(
                            "WS AUTH OK : "
                            +
                            email
                    );





                }

                catch(Exception e){



                    System.out.println(
                            "ERREUR JWT WS : "
                            +
                            e.getMessage()
                    );


                }



            }

            else {



                System.out.println(
                        "AUCUN TOKEN WS"
                );


            }



        }







        /*
        ===================================
        VERIFICATION PRINCIPAL FINAL
        ===================================
        */


        if(accessor.getUser() != null){



            System.out.println(

                    "PRINCIPAL FINAL : "

                    +

                    accessor.getUser().getName()

            );


        }

        else{


            System.out.println(
                    "PRINCIPAL FINAL NULL"
            );


        }







        return message;


    }



}