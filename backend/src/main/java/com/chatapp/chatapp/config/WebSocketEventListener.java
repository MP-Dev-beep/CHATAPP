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







    /*
    =====================================
    UTILISATEUR CONNECTE
    =====================================
    */


    @EventListener
    public void onConnected(
            SessionConnectedEvent event
    ){



        System.out.println(
                "========== WS SESSION CONNECTED =========="
        );




        Principal principal =

                event.getUser();





        System.out.println(
                "PRINCIPAL CONNECT : "
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

        else {



            System.out.println(
                    "ERREUR : PRINCIPAL NULL"
            );


        }



    }












    /*
    =====================================
    UTILISATEUR DECONNECTE
    =====================================
    */



    @EventListener
    public void onDisconnected(
            SessionDisconnectEvent event
    ){



        System.out.println(
                "========== WS SESSION DISCONNECT =========="
        );





        Principal principal =

                event.getUser();






        System.out.println(
                "PRINCIPAL DISCONNECT : "
                +
                principal
        );







        if(principal != null){



            String email =

                    principal.getName();






            System.out.println(
                    "USER OFFLINE : "
                    +
                    email
            );







            presenceService.offline(
                    email
            );



        }



    }



}