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



    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;



    private LocalDateTime sentAt;



    private boolean read;



    /**
     * Utilisateur qui a envoyé le message
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;



    /**
     * Conversation associée
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;



    @PrePersist
    public void beforeSave(){

        if(sentAt == null){

            sentAt = LocalDateTime.now();

        }

    }

}