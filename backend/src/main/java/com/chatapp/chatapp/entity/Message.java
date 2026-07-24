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



    @Column(nullable = false)
    private String content;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;



    @Column(nullable = false)
    private LocalDateTime sentAt;



    /*
     * Message livré au destinataire
     * ✓✓ gris
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean delivered = false;



    private LocalDateTime deliveredAt;



    /*
     * Message lu
     * ✓✓ bleu
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean read = false;



    private LocalDateTime readAt;



    @PrePersist
    public void beforeSave(){

        if(sentAt == null){

            sentAt = LocalDateTime.now();

        }

    }

}