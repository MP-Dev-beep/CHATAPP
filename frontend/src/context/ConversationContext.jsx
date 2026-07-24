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


    const {user} = useUsers();



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



    const typingTimer = useRef(null);









    async function loadConversations(){


        try{


            const data = await getConversations();


            setConversations(
                data || []
            );


        }
        catch(error){


            console.error(
                "Erreur conversations",
                error
            );


        }


    }









    async function openConversation(id){


        if(!user){

            return;

        }





        setConversationId(id);





        try{


            /*
            ===========================
            CHARGEMENT HISTORIQUE
            ===========================
            */


            const history = await getMessages(id);



            setMessages(
                history || []
            );








            /*
            ===========================
            CONNEXION WEBSOCKET
            ===========================
            */


            connectWebSocket(


                id,


                user.id,



                /*
                NOUVEAU MESSAGE
                */


                (message)=>{



                    setMessages(prev=>{


                        const existe =

                        prev.some(

                            m=>m.id===message.id

                        );



                        if(existe){

                            return prev;

                        }




                        return [

                            ...prev,

                            message

                        ];



                    });






                    /*
                    MESSAGE RECU
                    => ✓✓ GRIS
                    */


                    if(

                        message.senderId !== user.id

                    ){


                        sendDelivered(

                            message.id

                        );


                    }







                    setConversations(prev=>



                        prev.map(conv=>



                            conv.id===id


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









                /*
                STATUS MESSAGE
                */


                (status)=>{



                    setMessages(prev=>



                        prev.map(message=>



                            message.id===status.id


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










                /*
                TYPING
                */


                (username)=>{



                    setTypingUser(
                        username
                    );




                    if(typingTimer.current){


                        clearTimeout(
                            typingTimer.current
                        );


                    }




                    typingTimer.current =


                    setTimeout(()=>{


                        setTypingUser(null);


                    },2000);



                }



            );









            /*
            ===========================
            MARQUER LES MESSAGES COMME LUS
            ===========================
            */


            history.forEach(message=>{


                if(

                    message.senderId !== user.id

                    &&

                    !message.read

                ){



                    sendRead(

                        message.id

                    );


                }



            });









            /*
            ===========================
            RESET BADGE
            ===========================
            */


            setConversations(prev=>


                prev.map(conv=>


                    conv.id===id


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


            disconnectWebSocket();




            if(typingTimer.current){


                clearTimeout(

                    typingTimer.current

                );


            }


        };



    },[user]);












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


                refreshConversations:loadConversations



            }}



        >


            {children}



        </ConversationContext.Provider>


    );



}









export function useConversation(){



    const context = useContext(
        ConversationContext
    );



    if(!context){


        throw new Error(

            "useConversation doit être utilisé dans ConversationProvider"

        );


    }



    return context;


}