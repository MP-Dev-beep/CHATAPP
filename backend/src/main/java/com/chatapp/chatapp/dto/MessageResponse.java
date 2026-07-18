package com.chatapp.chatapp.dto;


import lombok.Builder;
import lombok.Getter;


import java.time.LocalDateTime;



@Getter
@Builder
public class MessageResponse {


    private Long id;


    private String content;


    private Long conversationId;


    private Long senderId;


    private String senderFirstname;


    private LocalDateTime sentAt;


   private String status;


}