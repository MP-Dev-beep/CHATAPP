package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;

import com.chatapp.chatapp.entity.Conversation;
import com.chatapp.chatapp.entity.Message;
import com.chatapp.chatapp.entity.User;

import com.chatapp.chatapp.repository.MessageRepository;
import com.chatapp.chatapp.repository.UserRepository;


import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;



@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {



    private final MessageRepository messageRepository;

    private final UserRepository userRepository;

    private final ConversationService conversationService;





    /*
    ==========================================
        ENVOYER MESSAGE
    ==========================================
    */


    public MessageResponse sendMessage(

            String email,

            MessageRequest request

    ){


        User sender = userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );




        Conversation conversation =

                conversationService.getConversationForUser(

                        request.getConversationId(),

                        email

                );





        Message message = Message.builder()

                .content(
                        request.getContent()
                )

                .sender(sender)

                .conversation(conversation)

                .sentAt(
                        LocalDateTime.now()
                )

                .delivered(false)

                .read(false)

                .build();





        Message saved =

                messageRepository.save(message);



        return convert(saved);


    }







    /*
    ==========================================
        HISTORIQUE MESSAGES
    ==========================================
    */


    public List<MessageResponse> getMessages(

            String email,

            Long conversationId

    ){


        conversationService.getConversationForUser(

                conversationId,

                email

        );




        return messageRepository

                .findByConversationIdOrderBySentAtAsc(
                        conversationId
                )

                .stream()

                .map(this::convert)

                .toList();


    }









    /*
    ==========================================
        MARQUER TOUTE LA CONVERSATION LUE
    ==========================================
    */


    public void markConversationAsRead(

            Long conversationId,

            String email

    ){


        conversationService.getConversationForUser(

                conversationId,

                email

        );




        List<Message> messages =

                messageRepository.findByConversationId(
                        conversationId
                );




        for(Message message : messages){



            if(!message.isRead()){



                message.setDelivered(true);


                message.setRead(true);




                if(message.getDeliveredAt()==null){


                    message.setDeliveredAt(
                            LocalDateTime.now()
                    );

                }





                if(message.getReadAt()==null){


                    message.setReadAt(
                            LocalDateTime.now()
                    );

                }



            }



        }



        messageRepository.saveAll(messages);



    }









    /*
    ==========================================
        MESSAGE LIVRE ✓✓ GRIS
    ==========================================
    */


    public MessageResponse markAsDelivered(

            Long id,

            String email

    ){



        Message message =

                messageRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Message introuvable"
                        )
                );





        conversationService.getConversationForUser(

                message.getConversation().getId(),

                email

        );





        message.setDelivered(true);





        if(message.getDeliveredAt()==null){


            message.setDeliveredAt(
                    LocalDateTime.now()
            );


        }






        return convert(

                messageRepository.save(message)

        );


    }









    /*
    ==========================================
        MESSAGE LU ✓✓ BLEU
    ==========================================
    */


    public MessageResponse markAsRead(

            Long id,

            String email

    ){



        Message message =

                messageRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Message introuvable"
                        )
                );





        conversationService.getConversationForUser(

                message.getConversation().getId(),

                email

        );






        message.setDelivered(true);

        message.setRead(true);






        if(message.getDeliveredAt()==null){


            message.setDeliveredAt(
                    LocalDateTime.now()
            );


        }







        if(message.getReadAt()==null){


            message.setReadAt(
                    LocalDateTime.now()
            );


        }







        return convert(

                messageRepository.save(message)

        );


    }









    /*
    ==========================================
        ENTITY -> DTO
    ==========================================
    */


    private MessageResponse convert(

            Message message

    ){



        MessageResponse response =

                new MessageResponse();





        response.setId(
                message.getId()
        );



        response.setContent(
                message.getContent()
        );



        response.setConversationId(

                message.getConversation().getId()

        );



        response.setSenderId(

                message.getSender().getId()

        );



        response.setSenderFirstname(

                message.getSender().getFirstname()

        );



        response.setSentAt(

                message.getSentAt()

        );



        response.setDelivered(

                message.isDelivered()

        );



        response.setRead(

                message.isRead()

        );



        response.setDeliveredAt(

                message.getDeliveredAt()

        );



        response.setReadAt(

                message.getReadAt()

        );




        return response;


    }




}