package com.chatapp.chatapp.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "conversations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    /**
     * Premier utilisateur de la conversation
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user1_id",
            nullable = false
    )
    private User user1;



    /**
     * Deuxième utilisateur de la conversation
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user2_id",
            nullable = false
    )
    private User user2;



    /**
     * Date création conversation
     */
    @Column(nullable = false)
    private LocalDateTime createdAt;



    /**
     * Messages liés
     */
    @OneToMany(
            mappedBy = "conversation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Message> messages =
            new ArrayList<>();



    @PrePersist
    public void beforeSave(){

        if(createdAt == null){

            createdAt = LocalDateTime.now();

        }

    }

}