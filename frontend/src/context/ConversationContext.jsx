import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback
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
        user,
        users
    } = useUsers();



    const [conversations,setConversations] = useState([]);

    const [conversationId,setConversationId] = useState(null);

    const [messages,setMessages] = useState([]);

    const [typingUser,setTypingUser] = useState(null);

    const [replyMessage,setReplyMessage] = useState(null);



    const typingTimer = useRef(null);

    const socketConversation = useRef(null);

    const mounted = useRef(false);





    const clearTyping = ()=>{

        if(typingTimer.current){

            clearTimeout(
                typingTimer.current
            );

            typingTimer.current=null;
        }


        setTypingUser(null);

    };







    const loadConversations = useCallback(async()=>{


        try{


            const data =
                await getConversations();



            const list =
                Array.isArray(data)
                ?
                data.map(conv=>{


                    return {

                        ...conv,

                        users:
                        conv.users?.map(convUser=>{


                            const fresh =
                                users.find(
                                    u =>
                                    Number(u.id)
                                    ===
                                    Number(convUser.id)
                                );


                            return fresh
                            ?
                            {
                                ...convUser,
                                firstname:fresh.firstname,
                                lastname:fresh.lastname,
                                avatar:fresh.avatar,
                                online:fresh.online
                            }
                            :
                            convUser;


                        })

                    };


                })
                :
                [];



            setConversations(list);



        }
        catch(error){

            console.error(
                "Erreur chargement conversations",
                error
            );

        }


    },[users]);










    function handleProfileUpdate(){

        loadConversations();

    }









    async function openConversation(id){


        if(!user || !id){

            return;

        }



        if(
            Number(socketConversation.current)
            ===
            Number(id)
        ){

            return;

        }



        try{


            disconnectWebSocket();


            clearTyping();



            socketConversation.current=id;



            setConversationId(id);




            const history =
                await getMessages(id);



            setMessages(
                Array.isArray(history)
                ?
                history
                :
                []
            );





            connectWebSocket(


                id,


                user.id,



                (message)=>{


                    if(!message?.id){

                        return;

                    }





                    setMessages(prev=>{


                        const exists =
                            prev.some(
                                m =>
                                Number(m.id)
                                ===
                                Number(message.id)
                            );


                        if(exists){


                            return prev.map(m=>

                                Number(m.id)
                                ===
                                Number(message.id)

                                ?
                                message

                                :
                                m

                            );

                        }



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


                    if(!status?.id){

                        return;

                    }



                    setMessages(prev=>

                        prev.map(msg=>


                            Number(msg.id)
                            ===
                            Number(status.id)

                            ?

                            {

                                ...msg,

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

                            msg


                        )

                    );


                },





                (typing)=>{


                    clearTyping();



                    if(
                        !typing
                    ){

                        return;

                    }



                    setTypingUser(
                        typing
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


        if(!user){

            return;

        }



        if(!mounted.current){

            mounted.current=true;

            loadConversations();

        }



        window.addEventListener(
            "profileUpdated",
            handleProfileUpdate
        );



        return ()=>{


            window.removeEventListener(
                "profileUpdated",
                handleProfileUpdate
            );


        };



    },[user,loadConversations]);











    useEffect(()=>{


        return ()=>{


            clearTyping();


            disconnectWebSocket();


            socketConversation.current=null;


        };


    },[]);











    return (

        <ConversationContext.Provider


            value={{

                conversations,

                conversationId,

                messages,

                typingUser,


                setMessages,


                openConversation,


                loadConversations,


                refreshConversations:
                loadConversations,


                refreshConversationUsers:
                loadConversations,


                replyMessage,


                setReplyMessage


            }}


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