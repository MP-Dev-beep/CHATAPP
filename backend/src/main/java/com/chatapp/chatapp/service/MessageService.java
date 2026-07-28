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

        /*
        ==========================================
        MESSAGE AUQUEL ON REPOND
        ==========================================
        */
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
                /*
                ==========================
                FICHIER
                ==========================
                */
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
                /*
                ==========================
                REPONSE MESSAGE
                ==========================
                */
                .replyMessage(
                        repliedMessage
                )
                .sentAt(
                        LocalDateTime.now()
                )
                .delivered(false)
                .read(false)
                .build();

        /*
        ==========================================
        DESTINATAIRE ONLINE
        MESSAGE LIVRE AUTOMATIQUEMENT
        ==========================================
        */
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
        SUPPRIMER UN MESSAGE (FAÇON TELEGRAM)
    ==================================================
    */
    public MessageResponse deleteMessage(String email, Long messageId, boolean deleteForEveryone) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message introuvable"));

        // Vérifier que l'utilisateur connecté est bien l'auteur du message
        if (!message.getSender().getEmail().equals(email)) {
            throw new RuntimeException("Action non autorisée : tu n'es pas l'auteur de ce message");
        }

        if (deleteForEveryone) {
            // Empêcher de supprimer pour tout le monde si le message a déjà été lu
            if (message.isRead()) {
                throw new RuntimeException("Impossible de supprimer pour tout le monde : le message a déjà été lu.");
            }
            
            // Soft delete : On modifie le contenu
            message.setContent("Ce message a été supprimé");
            message.setFileName(null);
            message.setFileType(null);
            message.setFileUrl(null);
            
            Message saved = messageRepository.save(message);
            
            return convert(saved);
        } else {
            // Supprimer uniquement pour soi (suppression définitive de la base)
            messageRepository.delete(message);
            return null;
        }
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

        /*
        FICHIER
        */
        response.setFileName(
                message.getFileName()
        );

        response.setFileType(
                message.getFileType()
        );

        response.setFileUrl(
                message.getFileUrl()
        );

        /*
        ====================================
        REPONSE MESSAGE
        ====================================
        */
        if(message.getReplyMessage()!=null){
            response.setReplyToId(
                    message.getReplyMessage().getId()
            );

            response.setReplyContent(
                    message.getReplyMessage().getContent()
            );
        }

        /*
        STATUT
        */
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

        return response;
    }
}