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
    FICHIER
    */

    private String fileName;

    private String fileType;

    private String fileUrl;

    /*
    ✓✓ gris
    */

    private boolean delivered;

    private LocalDateTime deliveredAt;

    /*
    ✓✓ bleu
    */

    private boolean read;

    private LocalDateTime readAt;

    private Long replyToId;

    private String replyContent;

    /*
    SUPPRESSION / MODIFICATION
    */

    private boolean deleted;

    private boolean edited;

}