package com.chatapp.chatapp.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    private String firstname;



    private String lastname;



    @Column(unique = true, nullable = false)
    private String email;



    private String password;



    private String avatar;



    private boolean online;



    /**
     * Conversations créées par cet utilisateur
     */
    @OneToMany(
            mappedBy = "user1",
            cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<Conversation> conversationsCreated =
            new ArrayList<>();



    /**
     * Conversations où il est le deuxième utilisateur
     */
    @OneToMany(
            mappedBy = "user2",
            cascade = CascadeType.ALL
    )
    @Builder.Default
    private List<Conversation> conversationsReceived =
            new ArrayList<>();


}