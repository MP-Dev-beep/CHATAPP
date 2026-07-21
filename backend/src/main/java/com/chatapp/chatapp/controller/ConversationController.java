package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.ConversationResponse;
import com.chatapp.chatapp.dto.CreateConversationRequest;
import com.chatapp.chatapp.service.ConversationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ConversationController {


    private final ConversationService conversationService;



    // =====================================
    // LISTE DES CONVERSATIONS
    // GET /api/conversations
    // =====================================

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getConversations(
            Authentication authentication
    ){


        String email =
                authentication.getName();


        return ResponseEntity.ok(
                conversationService.getUserConversations(
                        email
                )
        );

    }




    // =====================================
    // CREER CONVERSATION
    // POST /api/conversations
    // =====================================

    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            Authentication authentication,
            @RequestBody CreateConversationRequest request
    ){


        String email =
                authentication.getName();



        return ResponseEntity.ok(
                conversationService.createConversation(
                        email,
                        request
                )
        );

    }



}