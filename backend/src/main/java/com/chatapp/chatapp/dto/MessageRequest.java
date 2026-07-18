package com.chatapp.chatapp.dto;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MessageRequest {


    private Long conversationId;


    private String content;


}