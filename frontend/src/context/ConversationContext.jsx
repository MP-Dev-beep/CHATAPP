import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef
} from "react";

import {
    getConversations
} from "../services/conversation";

import {
    getMessages
} from "../services/message";

import {
    connectWebSocket,
    disconnectWebSocket,
    sendDelivered,
    sendRead
} from "../services/websocket";

import {
    useUsers
} from "./UserContext";

const ConversationContext = createContext();

export function ConversationProvider({children}){

    const {
        user
    } = useUsers();

    const [
        conversations,
        setConversations
    ] = useState([]);

    const [
        conversationId,
        setConversationId
    ] = useState(null);

    const [
        messages,
        setMessages
    ] = useState([]);

    const [
        typingUser,
        setTypingUser
    ] = useState(null);

    const [
        replyMessage,
        setReplyMessage
    ] = useState(null);

    const typingTimer = useRef(null);
    const currentSocketConversation = useRef(null);

    async function loadConversations(){
        try{
            const data = await getConversations();
            setConversations(
                Array.isArray(data)
                ? data
                : []
            );
        }
        catch(error){
            console.error(
                "Erreur chargement conversations",
                error
            );
        }
    }

    function clearTyping(){
        if(typingTimer.current){
            clearTimeout(
                typingTimer.current
            );
            typingTimer.current=null;
        }
        setTypingUser(null);
    }

    async function openConversation(id){
        if(!user || !id)
            return;

        try{
            // éviter plusieurs connexions identiques
            if(
                currentSocketConversation.current
                ===
                id
            ){
                return;
            }

            disconnectWebSocket();
            clearTyping();

            currentSocketConversation.current=id;
            setConversationId(id);

            const history =
                await getMessages(id);

            setMessages(
                Array.isArray(history)
                ? history
                : []
            );

            connectWebSocket(
                id,
                user.id,
                (message)=>{
                    if(!message || !message.id)
                        return;

                    // CORRECTION ICI : Mise à jour en temps réel (Ajout ou Remplacement si modifié)
                    setMessages(prev => {
                        const index = prev.findIndex(
                            m => Number(m.id) === Number(message.id)
                        );

                        if(index !== -1){
                            // Le message existe déjà -> On le remplace (ex: modification)
                            const updated = [...prev];
                            updated[index] = message;
                            return updated;
                        }

                        // Nouveau message -> On l'ajoute à la fin
                        return [
                            ...prev,
                            message
                        ];
                    });

                    if(
                        Number(message.senderId)
                        !==
                        Number(user.id)
                    ){
                        sendDelivered(
                            message.id
                        );
                    }

                    setConversations(prev=>
                        prev.map(conv=>
                            Number(conv.id)
                            ===
                            Number(id)
                            ?
                            {
                                ...conv,
                                lastMessage:
                                    message.content,
                                lastMessageTime:
                                    message.sentAt
                            }
                            :
                            conv
                        )
                    );
                },
                (status)=>{
                    if(!status || !status.id)
                        return;

                    setMessages(prev=>
                        prev.map(message=>
                            Number(message.id)
                            ===
                            Number(status.id)
                            ?
                            {
                                ...message,
                                delivered:
                                    status.delivered,
                                read:
                                    status.read,
                                deliveredAt:
                                    status.deliveredAt,
                                readAt:
                                    status.readAt
                            }
                            :
                            message
                        )
                    );
                },
                (username)=>{
                    clearTyping();

                    if(
                        typeof username
                        !==
                        "string"
                        ||
                        username.trim()===""
                    ){
                        return;
                    }

                    setTypingUser(
                        username
                    );

                    typingTimer.current =
                        setTimeout(()=>{
                            setTypingUser(null);
                        },2000);
                }
            );

            history.forEach(message=>{
                if(
                    Number(message.senderId)
                    !==
                    Number(user.id)
                    &&
                    !message.read
                ){
                    sendRead(
                        message.id
                    );
                }
            });

            setConversations(prev=>
                prev.map(conv=>
                    Number(conv.id)
                    ===
                    Number(id)
                    ?
                    {
                        ...conv,
                        unreadCount:0
                    }
                    :
                    conv
                )
            );
        }
        catch(error){
            console.error(
                "Erreur ouverture conversation",
                error
            );
        }
    }

    useEffect(()=>{
        if(user){
            loadConversations();
        }

        return ()=>{
            clearTyping();
            disconnectWebSocket();
            currentSocketConversation.current=null;
        };
    },[user]);

    return (
        <ConversationContext.Provider
            value={
                {
                    conversations,
                    conversationId,
                    messages,
                    typingUser,
                    setMessages,
                    openConversation,
                    loadConversations,
                    refreshConversations:
                        loadConversations,
                    replyMessage,
                    setReplyMessage
                }
            }
        >
            {children}
        </ConversationContext.Provider>
    );
}

export function useConversation(){
    const context =
        useContext(
            ConversationContext
        );

    if(!context){
        throw new Error(
            "useConversation doit être utilisé dans ConversationProvider"
        );
    }

    return context;
}