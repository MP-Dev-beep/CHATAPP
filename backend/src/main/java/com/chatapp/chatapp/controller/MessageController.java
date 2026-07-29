package com.chatapp.chatapp.controller;

import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.service.MessageService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class MessageController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    /*
    =========================================
        ENVOYER MESSAGE
    =========================================
    */
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication authentication,
            @RequestBody MessageRequest request
    ){
        return ResponseEntity.ok(
                messageService.sendMessage(
                        authentication.getName(),
                        request
                )
        );
    }

    /*
    =========================================
        MODIFIER UN MESSAGE
    =========================================
    */
    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> editMessage(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ){
        String newContent = payload.get("content");
        MessageResponse updated = messageService.editMessage(
                authentication.getName(),
                id,
                newContent
        );
        return ResponseEntity.ok(updated);
    }

    /*
    =========================================
        SUPPRIMER UN MESSAGE (FAÇON TELEGRAM)
    =========================================
    */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean deleteForEveryone
    ){
        messageService.deleteMessage(
                authentication.getName(),
                id,
                deleteForEveryone
        );

        return ResponseEntity.ok().body(Map.of("message", "Message supprimé avec succès"));
    }

    /*
    =========================================
        RECHERCHE DANS LES MESSAGES
    =========================================
    */
    @GetMapping("/search/{conversationId}")
    public ResponseEntity<List<MessageResponse>> searchMessages(
            Authentication authentication,
            @PathVariable Long conversationId,
            @RequestParam String query
    ){
        return ResponseEntity.ok(
                messageService.searchMessages(
                        authentication.getName(),
                        conversationId,
                        query
                )
        );
    }

    /*
    =========================================
        HISTORIQUE MESSAGES
    =========================================
    */
    @GetMapping("/conversation/{id}")
    public ResponseEntity<List<MessageResponse>> getMessages(
            Authentication authentication,
            @PathVariable Long id
    ){
        return ResponseEntity.ok(
                messageService.getMessages(
                        authentication.getName(),
                        id
                )
        );
    }

    /*
    =========================================
        MESSAGE LIVRE ✓✓ GRIS
    =========================================
    */
    @PutMapping("/delivered/{id}")
    public ResponseEntity<MessageResponse> markDelivered(
            Authentication authentication,
            @PathVariable Long id
    ){
        return ResponseEntity.ok(
                messageService.markAsDelivered(
                        id,
                        authentication.getName()
                )
        );
    }

    /*
    =========================================
        MESSAGE LU ✓✓ BLEU
    =========================================
    */
    @PutMapping("/read/{id}")
    public ResponseEntity<MessageResponse> markRead(
            Authentication authentication,
            @PathVariable Long id
    ){
        return ResponseEntity.ok(
                messageService.markAsRead(
                        id,
                        authentication.getName()
                )
        );
    }

    /*
    =========================================
        CONVERSATION LUE
    =========================================
    */
    @PutMapping("/conversation/read/{conversationId}")
    public ResponseEntity<Void> markConversationRead(
            Authentication authentication,
            @PathVariable Long conversationId
    ){
        messageService.markConversationAsRead(
                conversationId,
                authentication.getName()
        );
        return ResponseEntity.ok().build();
    }
}