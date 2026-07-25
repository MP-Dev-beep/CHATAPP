package com.chatapp.chatapp.dto;


import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
public class MessageRequest {



    private Long conversationId;



    /*
    Message texte
    */

    private String content;





    /*
    Fichier attaché
    */


    private String fileName;



    private String fileType;



    private String fileUrl;



}