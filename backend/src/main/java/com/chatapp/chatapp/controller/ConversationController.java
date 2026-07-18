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
@CrossOrigin("*")
public class ConversationController {



    private final ConversationService conversationService;



    // Créer une conversation
    @PostMapping
    public ResponseEntity<ConversationResponse> createConversation(
            Authentication authentication,
            @RequestBody CreateConversationRequest request
    ) {


        return ResponseEntity.ok(

                conversationService.createConversation(

                        authentication.getName(),

                        request

                )

        );

    }




    // Récupérer les conversations de l'utilisateur connecté
    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getConversations(
            Authentication authentication
    ) {


        return ResponseEntity.ok(

                conversationService.getUserConversations(

                        authentication.getName()

                )

        );

    }


}