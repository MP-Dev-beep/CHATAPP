package com.chatapp.chatapp.repository;


import com.chatapp.chatapp.entity.Message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;



public interface MessageRepository
        extends JpaRepository<Message,Long> {



    List<Message> findByConversationIdOrderBySentAtAsc(
            Long conversationId
    );




    List<Message> findByConversationId(
            Long conversationId
    );





    @Query("""
        SELECT COUNT(m)
        FROM Message m
        WHERE 
        m.conversation.id = :conversationId
        AND
        m.read = false
        AND
        m.sender.id <> :userId
    """)
    Long countUnreadMessages(
            
            @Param("conversationId")
            Long conversationId,


            @Param("userId")
            Long userId

    );





    /*
    Messages reçus non livrés
    */

    List<Message> findByConversationIdAndDeliveredFalse(
            Long conversationId
    );



    /*
    Recherche dans les messages d'une conversation
    */
    List<Message> findByConversationIdAndContentContainingIgnoreCase(
            Long conversationId,
            String content
    );

}