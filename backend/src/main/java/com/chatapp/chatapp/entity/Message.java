package com.chatapp.chatapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
    ================================
    TEXTE DU MESSAGE
    ================================
    */
    @Column(nullable = true)
    private String content;

    /*
    ================================
    FICHIER ATTACHE
    ================================
    */
    @Column(length = 255)
    private String fileName;

    @Column(length = 100)
    private String fileType;

    @Column(length = 500)
    private String fileUrl;

    /*
    ================================
    CONVERSATION
    ================================
    */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;

    /*
    ================================
    EXPEDITEUR
    ================================
    */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;

    /*
    ================================
    MESSAGE REPONDU
    ================================
    */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "reply_message_id"
    )
    private Message replyMessage;

    @Column(nullable = false)
    private LocalDateTime sentAt;

    private boolean delivered;
    private LocalDateTime deliveredAt;

    private boolean read;
    private LocalDateTime readAt;

    /*
    ================================
    STATUTS MODIFICATION / SUPPRESSION
    ================================
    */
    @Transient
    private boolean deleted;

    @Transient
    private boolean edited;

    @Transient
    private LocalDateTime editedAt;

}