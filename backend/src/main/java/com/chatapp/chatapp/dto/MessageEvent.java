package com.chatapp.chatapp.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;


import java.time.LocalDateTime;



@Getter
@AllArgsConstructor
public class MessageEvent {


    private Long id;


    private Long conversationId;


    private Long senderId;


    private String content;


    private LocalDateTime sentAt;


}