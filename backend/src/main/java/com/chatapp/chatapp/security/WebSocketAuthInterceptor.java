package com.chatapp.chatapp.security;


import com.chatapp.chatapp.service.JwtService;


import lombok.RequiredArgsConstructor;


import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;

import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;

import org.springframework.stereotype.Component;


import java.security.Principal;
import java.util.Map;




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

                StompHeaderAccessor.wrap(message);







        System.out.println(

                "STOMP COMMAND : "

                +

                accessor.getCommand()

        );









        // ===========================
        // CONNEXION
        // ===========================


        if(
                StompCommand.CONNECT.equals(
                        accessor.getCommand()
                )
        ){



            String auth =

                    accessor.getFirstNativeHeader(

                            "Authorization"

                    );





            if(

                    auth != null &&

                    auth.startsWith("Bearer ")

            ){



                String token =

                        auth.substring(7);





                String email =

                        jwtService.extractEmail(

                                token

                        );








                Principal principal = () -> email;






                accessor.setUser(

                        principal

                );







                System.out.println(

                        "WEBSOCKET USER : "

                        +

                        email

                );



            }



        }









        // ===========================
        // RESTAURATION SESSION
        // ===========================


        if(

                accessor.getUser() == null

        ){



            Map<String,Object> attributes =

                    accessor.getSessionAttributes();





            if(attributes != null){



                Principal principal =


                        (Principal)

                        attributes.get(

                                "principal"

                        );





                if(principal != null){



                    accessor.setUser(

                            principal

                    );



                }


            }



        }









        // ===========================
        // SAUVEGARDE SESSION
        // ===========================


        if(

                accessor.getUser() != null

        ){



            Map<String,Object> attributes =

                    accessor.getSessionAttributes();





            if(attributes != null){



                attributes.put(

                        "principal",

                        accessor.getUser()

                );



            }



        }









        return MessageBuilder.createMessage(

                message.getPayload(),

                accessor.getMessageHeaders()

        );



    }



}