package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.entity.Conversation;
import com.chatapp.chatapp.entity.Message;
import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.ConversationRepository;
import com.chatapp.chatapp.repository.MessageRepository;
import com.chatapp.chatapp.repository.UserRepository;


import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class MessageService {



    private final MessageRepository messageRepository;

    private final ConversationRepository conversationRepository;

    private final UserRepository userRepository;





    // ==========================
    // ENVOYER UN MESSAGE
    // ==========================

    public MessageResponse sendMessage(
            String email,
            MessageRequest request
    ) {



        User sender = userRepository
                .findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );





        Conversation conversation =
                conversationRepository
                .findById(
                        request.getConversationId()
                )

                .orElseThrow(() ->
                        new RuntimeException(
                                "Conversation introuvable"
                        )
                );






        Message message = Message.builder()

                .content(
                        request.getContent()
                )

                .sentAt(
                        LocalDateTime.now()
                )

                .read(false)

                .sender(sender)

                .conversation(conversation)

                .build();







        Message savedMessage =
                messageRepository.save(message);






        return convertToResponse(
                savedMessage
        );


    }








    // ==========================
    // RECUPERER MESSAGES CONVERSATION
    // ==========================


    public List<MessageResponse> getMessages(
            Long conversationId
    ){



        return messageRepository

                .findByConversationIdOrderBySentAtAsc(
                        conversationId
                )

                .stream()

                .map(this::convertToResponse)

                .collect(Collectors.toList());


    }









    // ==========================
    // CONVERSION ENTITY -> DTO
    // ==========================


    private MessageResponse convertToResponse(
            Message message
    ){



        return MessageResponse.builder()


                .id(
                        message.getId()
                )


                .content(
                        message.getContent()
                )


                .conversationId(
                        message.getConversation().getId()
                )


                .senderId(
                        message.getSender().getId()
                )


                .senderFirstname(
                        message.getSender().getFirstname()
                )


                .sentAt(
                        message.getSentAt()
                )


                .status(

                        message.isRead()
                        ?
                        "READ"
                        :
                        "SENT"

                )


                .build();


    }



}