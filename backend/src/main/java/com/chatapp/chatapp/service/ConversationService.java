package com.chatapp.chatapp.service;


import com.chatapp.chatapp.dto.ConversationResponse;
import com.chatapp.chatapp.dto.CreateConversationRequest;
import com.chatapp.chatapp.dto.UserResponse;

import com.chatapp.chatapp.entity.Conversation;
import com.chatapp.chatapp.entity.User;

import com.chatapp.chatapp.repository.ConversationRepository;
import com.chatapp.chatapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;



@Service
@RequiredArgsConstructor
public class ConversationService {


    private final ConversationRepository conversationRepository;

    private final UserRepository userRepository;



    public ConversationResponse createConversation(
            String email,
            CreateConversationRequest request
    ) {


        User currentUser =
                userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur connecté introuvable"
                        )
                );



        User receiver =
                userRepository.findById(
                        request.getUserId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Destinataire introuvable"
                        )
                );



        if(currentUser.getId()
                .equals(receiver.getId())) {

            throw new RuntimeException(
                    "Impossible de discuter avec soi-même"
            );

        }




        Conversation conversation =

                conversationRepository
                .findConversationBetweenUsers(
                        currentUser.getId(),
                        receiver.getId()
                )

                .orElseGet(() -> {


                    Conversation newConversation =
                            Conversation.builder()

                            .user1(currentUser)

                            .user2(receiver)

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
    ) {


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
    ) {


        UserResponse user1 =
                UserResponse.builder()

                .id(
                        conversation.getUser1()
                        .getId()
                )

                .firstname(
                        conversation.getUser1()
                        .getFirstname()
                )

                .lastname(
                        conversation.getUser1()
                        .getLastname()
                )

                .email(
                        conversation.getUser1()
                        .getEmail()
                )

                .build();




        UserResponse user2 =
                UserResponse.builder()

                .id(
                        conversation.getUser2()
                        .getId()
                )

                .firstname(
                        conversation.getUser2()
                        .getFirstname()
                )

                .lastname(
                        conversation.getUser2()
                        .getLastname()
                )

                .email(
                        conversation.getUser2()
                        .getEmail()
                )

                .build();




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

                .build();

    }


}