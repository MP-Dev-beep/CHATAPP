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
    =================================
    TEXTE DU MESSAGE
    =================================
    */


    @Column(nullable = true)
    private String content;







    /*
    =================================
    FICHIER ATTACHE
    =================================
    */


    /*
    Nom original du fichier

    Exemple:
    photo.png
    document.pdf
    */

    @Column(length = 255)
    private String fileName;





    /*
    Type du fichier

    Exemple:
    IMAGE
    PDF
    VIDEO
    AUDIO
    DOCUMENT
    */

    @Column(length = 100)
    private String fileType;





    /*
    Chemin accessible par React

    Exemple:
    /uploads/photo.png

    */

    @Column(length = 500)
    private String fileUrl;








    /*
    =================================
    CONVERSATION
    =================================
    */


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;









    /*
    =================================
    EXPEDITEUR
    =================================
    */


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;




/*
=================================
MESSAGE REPONDU
=================================
*/

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(
        name = "reply_message_id"
)
private Message replyMessage;




    /*
    =================================
    DATE ENVOI
    =================================
    */


    @Column(nullable = false)
    private LocalDateTime sentAt;









    /*
    =================================
    MESSAGE LIVRE
    ✓✓ GRIS
    =================================
    */


    @Builder.Default
    @Column(nullable = false)
    private boolean delivered = false;



    private LocalDateTime deliveredAt;









    /*
    =================================
    MESSAGE LU
    ✓✓ BLEU
    =================================
    */


    @Builder.Default
    @Column(nullable = false)
    private boolean read = false;



    private LocalDateTime readAt;









    /*
    =================================
    CREATION AUTOMATIQUE
    =================================
    */


    @PrePersist
    public void beforeSave(){


        if(sentAt == null){


            sentAt = LocalDateTime.now();


        }


    }



}