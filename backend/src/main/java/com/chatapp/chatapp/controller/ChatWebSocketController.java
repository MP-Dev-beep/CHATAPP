package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.ChatMessageRequest;
import com.chatapp.chatapp.dto.ChatMessageResponse;
import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.service.MessageService;


import lombok.RequiredArgsConstructor;


import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;


import java.security.Principal;



@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {


    private final MessageService messageService;


    private final SimpMessagingTemplate messagingTemplate;




    @MessageMapping("/chat.send")
    public void sendMessage(
            ChatMessageRequest request,
            Principal principal
    ) {



        try {



            if(principal == null){

                System.out.println(
                    "Utilisateur WebSocket inconnu"
                );

                return;

            }




            String email =
                    principal.getName();





            MessageRequest messageRequest =
                    new MessageRequest();



            messageRequest.setConversationId(
                    request.getConversationId()
            );



            messageRequest.setContent(
                    request.getContent()
            );





            MessageResponse saved =
                    messageService.sendMessage(

                            email,

                            messageRequest

                    );







            ChatMessageResponse response =
                    ChatMessageResponse.builder()


                    .id(
                        saved.getId()
                    )


                    .conversationId(
                        saved.getConversationId()
                    )


                    .senderId(
                        saved.getSenderId()
                    )


                    .senderFirstname(
                        saved.getSenderFirstname()
                    )


                    .content(
                        saved.getContent()
                    )


                    .sentAt(
                        saved.getSentAt()
                    )


                    .build();







            messagingTemplate.convertAndSend(

                    "/topic/conversation/"
                    +
                    request.getConversationId(),

                    response

            );





            System.out.println(
                "Message envoyé par "
                + email
                + " : "
                + response.getContent()
            );




        }
        catch(Exception e){

            e.printStackTrace();

        }


    }


}