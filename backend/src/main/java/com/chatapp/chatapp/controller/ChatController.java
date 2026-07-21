package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.dto.MessageStatusRequest;
import com.chatapp.chatapp.service.MessageService;


import lombok.RequiredArgsConstructor;


import org.springframework.messaging.handler.annotation.MessageMapping;
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



        if(principal == null){

            System.out.println(
                "USER NULL"
            );

            return;

        }





        MessageResponse response =

                messageService.sendMessage(

                        principal.getName(),

                        request

                );






        System.out.println(
            "MESSAGE SEND : "
            +
            response.getId()
        );







        messagingTemplate.convertAndSend(


                "/topic/conversation/"
                +
                request.getConversationId(),


                response


        );



    }









    @MessageMapping("/message.delivered")
    public void delivered(
            MessageStatusRequest request
    ){



        System.out.println(
            "MESSAGE DELIVERED : "
            +
            request.getMessageId()
        );






        MessageResponse response =

                messageService.markAsDelivered(

                        request.getMessageId()

                );






        messagingTemplate.convertAndSend(


                "/topic/message-status/"
                +
                response.getSenderId(),


                response


        );



    }









    @MessageMapping("/message.read")
    public void read(
            MessageStatusRequest request
    ){



        System.out.println(
            "MESSAGE READ : "
            +
            request.getMessageId()
        );







        MessageResponse response =

                messageService.markAsRead(

                        request.getMessageId()

                );







        messagingTemplate.convertAndSend(


                "/topic/message-status/"
                +
                response.getSenderId(),


                response


        );



    }




}