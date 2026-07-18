package com.chatapp.chatapp.dto;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ChatMessageRequest {


    private Long conversationId;


    private String receiverEmail;


    private String content;


}