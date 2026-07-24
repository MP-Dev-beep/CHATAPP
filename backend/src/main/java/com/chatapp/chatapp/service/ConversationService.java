package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.ConversationResponse;
import com.chatapp.chatapp.dto.CreateConversationRequest;
import com.chatapp.chatapp.dto.UserResponse;

import com.chatapp.chatapp.entity.Conversation;
import com.chatapp.chatapp.entity.Message;
import com.chatapp.chatapp.entity.User;

import com.chatapp.chatapp.repository.ConversationRepository;
import com.chatapp.chatapp.repository.UserRepository;


import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;



@Service
@RequiredArgsConstructor
@Transactional
public class ConversationService {


    private final ConversationRepository conversationRepository;

    private final UserRepository userRepository;




    /*
    =================================================
        CREATION CONVERSATION
    =================================================
    */


    public ConversationResponse createConversation(
            String email,
            CreateConversationRequest request
    ){


        User currentUser =

                userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur connecté introuvable"
                        )
                );




        User otherUser =

                userRepository.findById(
                        request.getUserId()
                )

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur destinataire introuvable"
                        )
                );





        if(currentUser.getId()
                .equals(otherUser.getId())){


            throw new RuntimeException(
                    "Impossible de créer une conversation avec soi-même"
            );

        }





        return conversationRepository

                .findConversationBetweenUsers(
                        currentUser.getId(),
                        otherUser.getId()
                )

                .map(this::convertToResponse)

                .orElseGet(() -> {


                    Conversation conversation =

                            Conversation.builder()

                            .user1(currentUser)

                            .user2(otherUser)

                            .createdAt(
                                    LocalDateTime.now()
                            )

                            .build();



                    Conversation saved =

                            conversationRepository.save(
                                    conversation
                            );



                    return convertToResponse(saved);


                });



    }









    /*
    =================================================
        CONVERSATIONS UTILISATEUR CONNECTE
    =================================================
    */


    public List<ConversationResponse> getUserConversations(
            String email
    ){


        User user =

                userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );





        return conversationRepository

                .findUserConversations(
                        user.getId()
                )

                .stream()

                .map(this::convertToResponse)

                .sorted(

                        Comparator.comparing(

                                ConversationResponse::getLastMessageTime,

                                Comparator.nullsLast(
                                        Comparator.reverseOrder()
                                )

                        )

                )

                .toList();



    }









    /*
    =================================================
        VERIFICATION ACCES CONVERSATION
    =================================================
    */


    public boolean canAccessConversation(
            Conversation conversation,
            User user
    ){


        return conversation.getUser1()
                .getId()
                .equals(user.getId())


                ||

                conversation.getUser2()
                .getId()
                .equals(user.getId());


    }









    /*
    =================================================
        RECUPERATION SECURISEE
    =================================================
    */


    public Conversation getConversationForUser(
            Long conversationId,
            String email
    ){


        User user =

                userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );




        Conversation conversation =

                conversationRepository.findById(
                        conversationId
                )

                .orElseThrow(() ->
                        new RuntimeException(
                                "Conversation introuvable"
                        )
                );





        if(!canAccessConversation(
                conversation,
                user
        )){


            throw new RuntimeException(
                    "Accès interdit à cette conversation"
            );


        }





        return conversation;


    }









    /*
=================================================
    CONVERSION ENTITY -> DTO
=================================================
*/

private ConversationResponse convertToResponse(
        Conversation conversation
){

    String lastMessage = null;

    LocalDateTime lastMessageTime = null;

    long unreadCount = 0;



    if (conversation.getMessages() != null
            && !conversation.getMessages().isEmpty()) {

        Message lastMessageEntity =

                conversation.getMessages()

                        .stream()

                        .filter(message -> message.getSentAt() != null)

                        .max(
                                Comparator.comparing(
                                        Message::getSentAt
                                )
                        )

                        .orElse(null);



        if (lastMessageEntity != null) {

            lastMessage = lastMessageEntity.getContent();

            lastMessageTime = lastMessageEntity.getSentAt();

        }



        unreadCount =

                conversation.getMessages()

                        .stream()

                        .filter(message -> !message.isRead())

                        .count();

    }



    return ConversationResponse.builder()

            .id(
                    conversation.getId()
            )

            .createdAt(
                    conversation.getCreatedAt()
            )

            .users(

                    List.of(

                            convertUser(
                                    conversation.getUser1()
                            ),

                            convertUser(
                                    conversation.getUser2()
                            )

                    )

            )

            .lastMessage(
                    lastMessage
            )

            .lastMessageTime(
                    lastMessageTime
            )

            .unreadCount(
                    unreadCount
            )

            .build();

}








    private UserResponse convertUser(
            User user
    ){


        return UserResponse.builder()

                .id(
                        user.getId()
                )

                .firstname(
                        user.getFirstname()
                )

                .lastname(
                        user.getLastname()
                )

                .email(
                        user.getEmail()
                )

                .avatar(
                        user.getAvatar()
                )

                .online(
                        user.isOnline()
                )

                .build();


    }



}