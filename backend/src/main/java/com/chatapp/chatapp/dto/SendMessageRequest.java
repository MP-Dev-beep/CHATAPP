package com.chatapp.chatapp.dto;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class SendMessageRequest {


    private Long conversationId;


    private String content;


}