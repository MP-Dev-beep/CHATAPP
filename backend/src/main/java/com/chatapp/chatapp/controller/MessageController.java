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
@CrossOrigin("*")
public class MessageController {



    private final MessageService messageService;





    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication authentication,
            @RequestBody MessageRequest request
    ) {


        return ResponseEntity.ok(

                messageService.sendMessage(

                        authentication.getName(),

                        request

                )

        );


    }






    @GetMapping("/conversation/{id}")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long id
    ) {


        return ResponseEntity.ok(

                messageService.getMessages(id)

        );


    }


}