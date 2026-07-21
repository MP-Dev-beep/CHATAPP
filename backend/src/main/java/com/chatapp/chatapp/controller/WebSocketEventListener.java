package com.chatapp.chatapp.controller;


import lombok.RequiredArgsConstructor;


import org.springframework.context.event.EventListener;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Component;


import org.springframework.web.socket.messaging.SessionConnectedEvent;

import org.springframework.web.socket.messaging.SessionDisconnectEvent;



import java.security.Principal;

import java.util.HashSet;

import java.util.Set;





@Component
@RequiredArgsConstructor
public class WebSocketEventListener {



    private final SimpMessagingTemplate messagingTemplate;




    private final Set<String> onlineUsers =
            new HashSet<>();









    @EventListener
    public void userConnected(
            SessionConnectedEvent event
    ){



        Principal principal =
                event.getUser();




        if(principal != null){



            onlineUsers.add(

                    principal.getName()

            );




            System.out.println(

                    "ONLINE : "

                    +

                    principal.getName()

            );




            sendUsersOnline();



        }


    }









    @EventListener
    public void userDisconnected(
            SessionDisconnectEvent event
    ){



        Principal principal =
                event.getUser();




        if(principal != null){



            onlineUsers.remove(

                    principal.getName()

            );




            System.out.println(

                    "OFFLINE : "

                    +

                    principal.getName()

            );




            sendUsersOnline();



        }



    }









    private void sendUsersOnline(){



        messagingTemplate.convertAndSend(


                "/topic/online-users",


                onlineUsers


        );



    }




}