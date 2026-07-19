package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.service.MessageService;


import lombok.RequiredArgsConstructor;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.stereotype.Controller;


import java.security.Principal;



@Controller
@RequiredArgsConstructor
public class ChatController {



    private final MessageService messageService;


    private final SimpMessagingTemplate messagingTemplate;






    @MessageMapping("/chat.send")
    public void sendMessage(
            MessageRequest request,
            Principal principal
    ){



        System.out.println(
            "Utilisateur WebSocket : "
            +
            principal
        );



        if(principal == null){

            System.out.println(
                "Aucun utilisateur connecté"
            );

            return;

        }




        MessageResponse response =
                messageService.sendMessage(
                        principal.getName(),
                        request
                );




        messagingTemplate.convertAndSend(

                "/topic/conversation/"
                +
                request.getConversationId(),

                response

        );


    }



}