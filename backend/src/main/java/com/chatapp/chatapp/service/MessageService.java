package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.entity.Message;
import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.entity.Conversation;

import com.chatapp.chatapp.repository.MessageRepository;
import com.chatapp.chatapp.repository.UserRepository;
import com.chatapp.chatapp.repository.ConversationRepository;


import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {



    private final MessageRepository messageRepository;

    private final UserRepository userRepository;

    private final ConversationRepository conversationRepository;








    /*
     *
     * CREATION MESSAGE
     *
     * Etat initial :
     *
     * ✓ envoyé
     *
     */

    public MessageResponse sendMessage(
            String email,
            MessageRequest request
    ){



        User sender =

                userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );





        Conversation conversation =

                conversationRepository.findById(
                        request.getConversationId()
                )

                .orElseThrow(() ->
                        new RuntimeException(
                                "Conversation introuvable"
                        )
                );







        Message message =

                Message.builder()

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

                messageRepository.save(
                        message
                );





        return convert(saved);



    }













    /*
     *
     * HISTORIQUE
     *
     */

    public List<MessageResponse> getMessages(
            Long conversationId
    ){


        return messageRepository

                .findByConversationIdOrderBySentAtAsc(
                        conversationId
                )

                .stream()

                .map(this::convert)

                .collect(Collectors.toList());


    }












    /*
     *
     * DESTINATAIRE A RECU
     *
     * ✓✓ GRIS
     *
     */

    public MessageResponse markAsDelivered(
            Long id
    ){



        Message message =

                messageRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Message introuvable"
                        )
                );





        if(!message.isDelivered()){


            message.setDelivered(true);



            message.setDeliveredAt(
                    LocalDateTime.now()
            );


        }







        Message saved =

                messageRepository.save(
                        message
                );





        return convert(saved);


    }












    /*
     *
     * DESTINATAIRE A LU
     *
     * ✓✓ BLEU
     *
     */

    public MessageResponse markAsRead(
            Long id
    ){



        Message message =

                messageRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Message introuvable"
                        )
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









        Message saved =

                messageRepository.save(
                        message
                );







        return convert(saved);



    }












    /*
     *
     * OUVERTURE CONVERSATION
     *
     * Tous les messages deviennent lus
     *
     */

    public void markConversationAsRead(
            Long conversationId
    ){



        List<Message> messages =

                messageRepository.findByConversationId(
                        conversationId
                );







        messages.forEach(message -> {



            if(!message.isRead()){


                message.setDelivered(true);

                message.setRead(true);





                if(message.getDeliveredAt()==null){


                    message.setDeliveredAt(
                            LocalDateTime.now()
                    );


                }





                message.setReadAt(
                        LocalDateTime.now()
                );


            }



        });






        messageRepository.saveAll(
                messages
        );


    }












    /*
     *
     * ENTITY -> DTO
     *
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