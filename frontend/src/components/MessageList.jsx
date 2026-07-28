import {
    useEffect,
     useRef
} from "react";

import MessageBubble from "./MessageBubble";

import {
    useConversation
} from "../context/ConversationContext";

function MessageList(){

    const {
        messages = [],
        setMessages
    } = useConversation();

    const bottomRef = useRef();

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({
            behavior:"smooth"
        });
    },[messages]);

    // Fonction pour mettre à jour le message localement (façon Telegram : affichage "Ce message a été supprimé" ou masquage)
    const handleDeleteMessageLocally = (deletedMessageId) => {
        if (setMessages) {
            setMessages(prevMessages => prevMessages.map(msg => 
                msg.id === deletedMessageId 
                    ? { ...msg, content: "Ce message a été supprimé", isDeleted: true } 
                    : msg
            ));
        }
    };

    return (
        <div className="messages">

            {
            messages.length === 0 ?
            (
                <div className="empty-chat">
                    <div className="empty-icon">
                        💬
                    </div>

                    <h3>
                        Aucun message
                    </h3>

                    <p>
                        Envoyez votre premier message
                    </p>
                </div>
            )
            :
            messages.map(message=>(
                <div
                    key={`${message.id}-${message.sentAt}`}
                    id={`message-${message.id}`}
                >
                    <MessageBubble
                        message={message}
                        onDelete={handleDeleteMessageLocally}
                    />
                </div>
            ))
            }

            <div ref={bottomRef}/>

        </div>
    );
}

export default MessageList;