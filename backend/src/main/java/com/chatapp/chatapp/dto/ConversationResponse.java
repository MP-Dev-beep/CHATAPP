package com.chatapp.chatapp.dto;


import lombok.Builder;
import lombok.Getter;


import java.time.LocalDateTime;
import java.util.List;



@Getter
@Builder
public class ConversationResponse {



    private Long id;



    private LocalDateTime createdAt;



    private List<UserResponse> users;



    private String lastMessage;



    private LocalDateTime lastMessageTime;



}