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





    public ConversationResponse createConversation(
            String email,
            CreateConversationRequest request
    ){


        User currentUser = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur connecté introuvable"
                        )
                );



        User otherUser = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur destinataire introuvable"
                        )
                );





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
                                    .createdAt(LocalDateTime.now())
                                    .build();



                    Conversation saved =
                            conversationRepository.save(
                                    conversation
                            );



                    return convertToResponse(saved);


                });



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



        String lastMessage = null;

        LocalDateTime lastMessageTime = null;





        if(conversation.getMessages()!=null
                &&
                !conversation.getMessages().isEmpty()
        ){


            Message message =

                    conversation.getMessages()
                            .stream()
                            .filter(m ->
                                    m.getSentAt()!=null
                            )
                            .max(
                                    Comparator.comparing(
                                            Message::getSentAt
                                    )
                            )
                            .orElse(null);



            if(message!=null){

                lastMessage =
                        message.getContent();


                lastMessageTime =
                        message.getSentAt();

            }


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