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






        if(StompCommand.CONNECT.equals(

                accessor.getCommand()

        )){



            String header =

                    accessor.getFirstNativeHeader(
                            "Authorization"
                    );





            System.out.println(
                    "========== WS CONNECT =========="
            );


            System.out.println(
                    "HEADER : " + header
            );







            if(header != null && header.startsWith("Bearer ")){

                try{


                    String token =

                            header.substring(7);




                    String email =

                            jwtService.extractEmail(
                                    token
                            );






                    UsernamePasswordAuthenticationToken auth =

                            new UsernamePasswordAuthenticationToken(

                                    email,

                                    null,

                                    Collections.emptyList()

                            );





                    accessor.setUser(auth);




                    System.out.println(
                            "WS USER AUTH : "
                            + email
                    );



                }
                catch(Exception e){


                    System.out.println(
                            "JWT WS ERROR : "
                            + e.getMessage()
                    );


                }


            }
            else{


                System.out.println(
                        "TOKEN WS ABSENT"
                );


            }


        }






        return message;


    }



}