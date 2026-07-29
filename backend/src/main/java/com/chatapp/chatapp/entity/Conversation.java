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




    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "user1_id",
            nullable = false
    )
    private User user1;




    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "user2_id",
            nullable = false
    )
    private User user2;




    @Column(nullable = false)
    private LocalDateTime createdAt;


    // NOUVEAU: Champ pour l'archivage
    @Builder.Default
    @Column(nullable = false)
    private boolean archived = false;





    @OneToMany(
            mappedBy = "conversation",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Message> messages = new ArrayList<>();






    @PrePersist
    public void beforeSave(){


        if(createdAt == null){

            createdAt = LocalDateTime.now();

        }


    }


}