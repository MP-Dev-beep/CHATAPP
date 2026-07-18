package com.chatapp.chatapp.repository;


import com.chatapp.chatapp.entity.Conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;



public interface ConversationRepository 
        extends JpaRepository<Conversation,Long> {



    @Query("""
        SELECT c 
        FROM Conversation c
        WHERE 
        (c.user1.id = :user1 AND c.user2.id = :user2)
        OR
        (c.user1.id = :user2 AND c.user2.id = :user1)
    """)
    Optional<Conversation> findConversationBetweenUsers(
            @Param("user1") Long user1,
            @Param("user2") Long user2
    );




    @Query("""
        SELECT c 
        FROM Conversation c
        WHERE 
        c.user1.id = :userId
        OR
        c.user2.id = :userId
        ORDER BY c.createdAt DESC
    """)
    List<Conversation> findUserConversations(
            @Param("userId") Long userId
    );


}