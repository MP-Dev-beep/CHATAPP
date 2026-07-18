package com.chatapp.chatapp.dto;


import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
@Builder
public class ChatMessageResponse {


    private Long id;


    private Long conversationId;


    private Long senderId;


    private String senderFirstname;


    private String content;


    private LocalDateTime sentAt;


}