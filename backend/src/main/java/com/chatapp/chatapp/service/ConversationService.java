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


import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;



@Service
@RequiredArgsConstructor
public class ConversationService {


    private final ConversationRepository conversationRepository;

    private final UserRepository userRepository;





    public ConversationResponse createConversation(
            String email,
            CreateConversationRequest request
    ){


        User currentUser =

                userRepository.findByEmail(email)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );





        User otherUser =

                userRepository.findById(
                        request.getUserId()
                )

                .orElseThrow(() ->
                        new RuntimeException(
                                "Destinataire introuvable"
                        )
                );







        Conversation conversation =

                conversationRepository

                .findConversationBetweenUsers(

                        currentUser.getId(),

                        otherUser.getId()

                )

                .orElseGet(() -> {


                    Conversation newConversation =

                            Conversation.builder()

                            .user1(currentUser)

                            .user2(otherUser)

                            .createdAt(
                                    LocalDateTime.now()
                            )

                            .build();



                    return conversationRepository.save(
                            newConversation
                    );


                });






        return convertToResponse(
                conversation
        );


    }









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

                .toList();



    }









    private ConversationResponse convertToResponse(
            Conversation conversation
    ){



        UserResponse user1 =

                convertUser(
                        conversation.getUser1()
                );



        UserResponse user2 =

                convertUser(
                        conversation.getUser2()
                );






        String lastMessage = null;

        LocalDateTime lastTime = null;







        if(conversation.getMessages()!=null &&

                !conversation.getMessages().isEmpty()){



            Message last =

                    conversation.getMessages()

                    .stream()

                    .max(
                            Comparator.comparing(
                                    Message::getSentAt
                            )
                    )

                    .get();




            lastMessage =
                    last.getContent();



            lastTime =
                    last.getSentAt();



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
                                user1,
                                user2
                        )

                )


                .lastMessage(
                        lastMessage
                )


                .lastMessageTime(
                        lastTime
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

                .build();


    }



}