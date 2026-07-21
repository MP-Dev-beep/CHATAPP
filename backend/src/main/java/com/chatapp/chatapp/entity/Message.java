package com.chatapp.chatapp.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;



@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "message")
public class Message {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(nullable = false)
    private String content;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;



    private LocalDateTime sentAt;



    /*
     * Message arrivé chez le destinataire
     * ✓✓ gris
     */
    @Builder.Default
    private boolean delivered = false;



    private LocalDateTime deliveredAt;



    /*
     * Message lu par le destinataire
     * ✓✓ bleu
     */
    @Builder.Default
    private boolean read = false;



    private LocalDateTime readAt;


}