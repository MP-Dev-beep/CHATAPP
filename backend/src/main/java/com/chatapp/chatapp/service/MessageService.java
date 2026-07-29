package com.chatapp.chatapp.service;

import com.chatapp.chatapp.dto.MessageRequest;
import com.chatapp.chatapp.dto.MessageResponse;
import com.chatapp.chatapp.entity.Conversation;
import com.chatapp.chatapp.entity.Message;
import com.chatapp.chatapp.entity.User;
import com.chatapp.chatapp.repository.MessageRepository;
import com.chatapp.chatapp.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationService conversationService;
    private final PresenceService presenceService;

    /*
    ==================================================
        ENVOYER MESSAGE
    ==================================================
    */
    public MessageResponse sendMessage(
            String email,
            MessageRequest request
    ) {
        User sender = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );

        Conversation conversation =
                conversationService.getConversationForUser(
                        request.getConversationId(),
                        email
                );

        Message repliedMessage = null;

        if(request.getReplyToId() != null){
            repliedMessage = messageRepository.findById(
                    request.getReplyToId()
            )
            .orElseThrow(() ->
                    new RuntimeException(
                            "Message de réponse introuvable"
                    )
            );
        }

        User receiver =
                conversation.getUser1()
                        .getEmail()
                        .equals(email)
                ?
                conversation.getUser2()
                :
                conversation.getUser1();

        Message message = Message.builder()
                .content(
                        request.getContent()
                )
                .fileName(
                        request.getFileName()
                )
                .fileType(
                        request.getFileType()
                )
                .fileUrl(
                        request.getFileUrl()
                )
                .sender(sender)
                .conversation(conversation)
                .replyMessage(
                        repliedMessage
                )
                .sentAt(
                        LocalDateTime.now()
                )
                .delivered(false)
                .read(false)
                .build();

        if(
                presenceService.isOnline(
                        receiver.getEmail()
                )
        ){
            message.setDelivered(true);
            message.setDeliveredAt(
                    LocalDateTime.now()
            );
        }

        Message saved =
                messageRepository.save(message);

        return convert(saved);
    }

    /*
    ==================================================
        MODIFIER UN MESSAGE
    ==================================================
    */
    public MessageResponse editMessage(String email, Long messageId, String newContent) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message introuvable"));

        if (!message.getSender().getEmail().equals(email)) {
            throw new RuntimeException("Action non autorisée : tu n'es pas l'auteur de ce message");
        }

        if (message.isDeleted()) {
            throw new RuntimeException("Impossible de modifier un message supprimé");
        }

        message.setContent(newContent);
        message.setEdited(true);
        message.setEditedAt(LocalDateTime.now());

        Message saved = messageRepository.save(message);
        return convert(saved);
    }

    /*
    ==================================================
        SUPPRIMER UN MESSAGE (FAÇON TELEGRAM)
    ==================================================
    */
    public MessageResponse deleteMessage(String email, Long messageId, boolean deleteForEveryone) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message introuvable"));

        if (!message.getSender().getEmail().equals(email)) {
            throw new RuntimeException("Action non autorisée : tu n'es pas l'auteur de ce message");
        }

        if (deleteForEveryone) {
            if (message.isRead()) {
                throw new RuntimeException("Impossible de supprimer pour tout le monde : le message a déjà été lu.");
            }
            
            message.setContent("Ce message a été supprimé");
            message.setDeleted(true);
            message.setFileName(null);
            message.setFileType(null);
            message.setFileUrl(null);
            
            Message saved = messageRepository.save(message);
            
            return convert(saved);
        } else {
            messageRepository.delete(message);
            return null;
        }
    }

    /*
    ==================================================
        RECHERCHE DANS LES MESSAGES
    ==================================================
    */
    public List<MessageResponse> searchMessages(String email, Long conversationId, String query) {
        conversationService.getConversationForUser(conversationId, email);
        return messageRepository.findByConversationIdAndContentContainingIgnoreCase(conversationId, query)
                .stream()
                .map(this::convert)
                .toList();
    }

    /*
    ==================================================
        HISTORIQUE
    ==================================================
    */
    public List<MessageResponse> getMessages(
            String email,
            Long conversationId
    ){
        conversationService.getConversationForUser(
                conversationId,
                email
        );

        return messageRepository
                .findByConversationIdOrderBySentAtAsc(
                        conversationId
                )
                .stream()
                .map(this::convert)
                .toList();
    }

    /*
    ==================================================
        MARQUER CONVERSATION LUE
    ==================================================
    */
    public void markConversationAsRead(
            Long conversationId,
            String email
    ){
        conversationService.getConversationForUser(
                conversationId,
                email
        );

        List<Message> messages =
                messageRepository.findByConversationId(
                        conversationId
                );

        for(Message message : messages){
            if(
                    !message.getSender()
                            .getEmail()
                            .equals(email)
            ){
                message.setDelivered(true);
                message.setRead(true);

                if(message.getDeliveredAt()==null){
                    message.setDeliveredAt(
                            LocalDateTime.now()
                    );
                }

                if(message.getReadAt()==null){
                    message.setReadAt(
                            LocalDateTime.now()
                    );
                }
            }
        }

        messageRepository.saveAll(messages);
    }

    /*
    ==================================================
        MESSAGE LIVRE
    ==================================================
    */
    public MessageResponse markAsDelivered(
            Long messageId,
            String email
    ){
        Message message =
                messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Message introuvable"
                        )
                );

        conversationService.getConversationForUser(
                message.getConversation().getId(),
                email
        );

        if(!message.isDelivered()){
            message.setDelivered(true);
            message.setDeliveredAt(
                    LocalDateTime.now()
            );
        }

        return convert(
                messageRepository.save(message)
        );
    }

    /*
    ==================================================
        MESSAGE LU
    ==================================================
    */
    public MessageResponse markAsRead(
            Long messageId,
            String email
    ){
        Message message =
                messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Message introuvable"
                        )
                );

        conversationService.getConversationForUser(
                message.getConversation().getId(),
                email
        );

        message.setDelivered(true);
        message.setRead(true);

        if(message.getDeliveredAt()==null){
            message.setDeliveredAt(
                    LocalDateTime.now()
            );
        }

        if(message.getReadAt()==null){
            message.setReadAt(
                    LocalDateTime.now()
            );
        }

        return convert(
                messageRepository.save(message)
        );
    }

    /*
    ==================================================
        COMPTER NON LUS
    ==================================================
    */
    public Long countUnreadMessages(
            Long conversationId,
            String email
    ){
        User user =
                userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Utilisateur introuvable"
                        )
                );

        conversationService.getConversationForUser(
                conversationId,
                email
        );

        return messageRepository.countUnreadMessages(
                conversationId,
                user.getId()
        );
    }

    /*
    ==================================================
        NON LIVRES
    ==================================================
    */
    public List<MessageResponse> getUndeliveredMessages(
            Long conversationId,
            String email
    ){
        conversationService.getConversationForUser(
                conversationId,
                email
        );

        return messageRepository
                .findByConversationIdAndDeliveredFalse(
                        conversationId
                )
                .stream()
                .map(this::convert)
                .toList();
    }

    /*
    ==================================================
        ENTITY -> DTO
    ==================================================
    */
    private MessageResponse convert(
            Message message
    ){
        MessageResponse response =
                new MessageResponse();

        response.setId(
                message.getId()
        );

        response.setContent(
                message.getContent()
        );

        response.setConversationId(
                message.getConversation().getId()
        );

        response.setSenderId(
                message.getSender().getId()
        );

        response.setSenderFirstname(
                message.getSender().getFirstname()
        );

        response.setSentAt(
                message.getSentAt()
        );

        response.setFileName(
                message.getFileName()
        );

        response.setFileType(
                message.getFileType()
        );

        response.setFileUrl(
                message.getFileUrl()
        );

        if(message.getReplyMessage()!=null){
            response.setReplyToId(
                    message.getReplyMessage().getId()
            );

            response.setReplyContent(
                    message.getReplyMessage().getContent()
            );
        }

        response.setDelivered(
                message.isDelivered()
        );

        response.setDeliveredAt(
                message.getDeliveredAt()
        );

        response.setRead(
                message.isRead()
        );

        response.setReadAt(
                message.getReadAt()
        );

        response.setDeleted(message.isDeleted());
        response.setEdited(message.isEdited());
        response.setEditedAt(message.getEditedAt()); // Transmet la date de modification au front-end

        return response;
    }
}