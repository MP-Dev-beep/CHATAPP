package com.chatapp.chatapp.config;


import com.chatapp.chatapp.service.PresenceService;

import lombok.RequiredArgsConstructor;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;



@Component
@RequiredArgsConstructor
public class WebSocketEventListener {



    private final PresenceService presenceService;






    @EventListener
    public void handleConnect(
            SessionConnectedEvent event
    ){


        Principal principal =

                event.getUser();





        System.out.println(
                "===== SESSION CONNECTED ====="
        );


        System.out.println(
                "PRINCIPAL : "
                +
                principal
        );






        if(principal != null){



            String email =

                    principal.getName();





            System.out.println(
                    "USER ONLINE : "
                    +
                    email
            );





            presenceService.online(
                    email
            );


        }

        else{


            System.out.println(
                    "PRINCIPAL NULL"
            );


        }



    }









    @EventListener
    public void handleDisconnect(
            SessionDisconnectEvent event
    ){



        Principal principal =

                event.getUser();





        if(principal != null){



            presenceService.offline(

                    principal.getName()

            );



        }



    }



}