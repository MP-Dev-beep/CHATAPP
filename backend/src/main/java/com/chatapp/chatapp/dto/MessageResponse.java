package com.chatapp.chatapp.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;






@Getter
@Setter
public class MessageResponse {



    private Long id;



    private String content;



    private Long conversationId;



    private Long senderId;



    private String senderFirstname;



    private LocalDateTime sentAt;



    /*
     *
     * ✓✓ gris
     *
     */
    private boolean delivered;




    /*
     *
     * ✓✓ bleu
     *
     */
    private boolean read;



    private LocalDateTime deliveredAt;

    private LocalDateTime readAt;





}