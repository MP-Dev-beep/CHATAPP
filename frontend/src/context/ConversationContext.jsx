import {
    createContext,
    useContext,
    useState,
    useEffect
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




    const [conversations,setConversations] =
        useState([]);



    const [conversationId,setConversationId] =
        useState(null);



    const [messages,setMessages] =
        useState([]);





    async function loadConversations(){


        try{


            const data =
                await getConversations();



            setConversations(
                data || []
            );


        }
        catch(error){


            console.error(
                "Erreur chargement conversations",
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


            const history =
                await getMessages(id);



            setMessages(
                history || []
            );



            /*
                Quand on ouvre une conversation,
                on marque les messages reçus comme lus
            */


            history.forEach(message=>{


                if(
                    message.senderId !== user.id
                    &&
                    !message.read
                ){

                    sendDelivered(
                        message.id
                    );


                    sendRead(
                        message.id
                    );

                }


            });





            connectWebSocket(


                id,


                user.id,



                (message)=>{


                    console.log(
                        "NOUVEAU MESSAGE",
                        message
                    );



                    /*
                       Réception côté destinataire
                       => reçu
                    */


                    if(
                        message.senderId !== user.id
                    ){

                        sendDelivered(
                            message.id
                        );

                    }





                    setMessages(prev=>{


                        const exists =
                            prev.some(
                                m =>
                                m.id === message.id
                            );



                        if(exists){

                            return prev;

                        }



                        return [

                            ...prev,

                            message

                        ];


                    });



                    loadConversations();



                },





                (status)=>{


                    console.log(
                        "STATUS MESSAGE",
                        status
                    );



                    setMessages(prev=>


                        prev.map(message=>


                            message.id === status.id

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



                    loadConversations();


                }



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


        };



    },[user]);










    return (


        <ConversationContext.Provider


            value={{


                conversations,


                conversationId,


                messages,


                setMessages,


                openConversation,


                loadConversations


            }}


        >


            {children}


        </ConversationContext.Provider>


    );



}








export function useConversation(){


    return useContext(
        ConversationContext
    );


}