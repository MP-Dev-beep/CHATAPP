package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.service.MessageService;


import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;



@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class MessageController {



    private final MessageService messageService;





    // ENVOYER MESSAGE

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







    // RECUPERER LES MESSAGES

    @GetMapping("/conversation/{id}")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long id
    ){


        return ResponseEntity.ok(

                messageService.getMessages(id)

        );

    }








    // MARQUER UNE CONVERSATION COMME LUE

    @PutMapping("/read/{conversationId}")
    public ResponseEntity<Void> markConversationRead(
            @PathVariable Long conversationId
    ){


        messageService.markConversationAsRead(
                conversationId
        );


        return ResponseEntity.ok().build();

    }



}