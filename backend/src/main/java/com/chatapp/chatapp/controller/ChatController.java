package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.dto.MessageStatusRequest;
import com.chatapp.chatapp.dto.TypingRequest;

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









    /*
    =====================================================
        ENVOYER MESSAGE TEMPS REEL

        React
        |
        /app/chat.send
        |
        sauvegarde BDD
        |
        diffusion conversation
    =====================================================
    */


    @MessageMapping("/chat.send")
    public void sendMessage(


            MessageRequest request,


            Principal principal


    ){



        if(principal == null){


            System.out.println(
                    "WEBSOCKET utilisateur non connecté"
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












    /*
    =====================================================
        MESSAGE LIVRE
        ✓✓ GRIS
    =====================================================
    */


    @MessageMapping("/message.delivered")
    public void delivered(



            MessageStatusRequest request,


            Principal principal



    ){



        if(principal == null){


            return;


        }







        MessageResponse response =


                messageService.markAsDelivered(



                        request.getMessageId(),



                        principal.getName()



                );









        messagingTemplate.convertAndSend(



                "/topic/message-status/"

                +

                response.getSenderId(),



                response



        );




    }












    /*
    =====================================================
        MESSAGE LU
        ✓✓ BLEU
    =====================================================
    */


    @MessageMapping("/message.read")
    public void read(



            MessageStatusRequest request,


            Principal principal



    ){



        if(principal == null){


            return;


        }








        MessageResponse response =


                messageService.markAsRead(



                        request.getMessageId(),



                        principal.getName()



                );









        messagingTemplate.convertAndSend(



                "/topic/message-status/"

                +

                response.getSenderId(),



                response



        );




    }












    /*
    =====================================================
        UTILISATEUR ECRIT
        "X est en train d'écrire..."
    =====================================================
    */


    @MessageMapping("/chat.typing")
    public void typing(



            TypingRequest request,


            Principal principal



    ){



        if(principal == null){


            return;


        }








        messagingTemplate.convertAndSend(



                "/topic/typing/"

                +

                request.getConversationId(),



                principal.getName()



        );



    }



}