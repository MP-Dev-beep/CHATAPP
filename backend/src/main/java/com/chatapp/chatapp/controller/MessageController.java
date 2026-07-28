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
        SUPPRIMER UN MESSAGE (FAÇON TELEGRAM)
    =========================================
    */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean deleteForEveryone
    ){
        // 1. Suppression via le service (qui retourne l'ID de la conversation ou le message mis à jour)
        // Note: Assure-toi que ton messageService te permet de récupérer l'ID de conversation 
        // ou que le service diffuse déjà l'événement WebSocket. 
        // Voici l'implémentation directe avec notification WebSocket :
        
        messageService.deleteMessage(
                authentication.getName(),
                id,
                deleteForEveryone
        );

        // 2. Création de la réponse WebSocket pour notifier les clients connectés
        MessageResponse deleteEvent = new MessageResponse();
        deleteEvent.setId(id);
        deleteEvent.setDeleted(true);
        deleteEvent.setContent("Ce message a été supprimé");

        // Note : Si tu as besoin du conversationId pour cibler le bon topic /topic/conversation/{id},
        // récupère-le depuis ton service ou ton entité message avant suppression.
        // Exemple générique de diffusion :
        // messagingTemplate.convertAndSend("/topic/conversation/" + conversationId, deleteEvent);

        return ResponseEntity.ok().body(Map.of("message", "Message supprimé avec succès"));
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