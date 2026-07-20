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
    connectWebSocket,
    disconnectWebSocket
} from "../services/websocket";


import {
    getMessages
} from "../services/message";




const ConversationContext = createContext(null);






export function ConversationProvider({children}) {



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







    async function loadConversations(){


        try{


            const data = await getConversations();



            console.log(
                 "Conversations détaillées :",
                  JSON.stringify(data, null, 2)
            );



            setConversations(
                data || []
            );



        }
        catch(error){


            console.error(
                "Erreur chargement conversations :",
                error
            );


        }


    }









    async function openConversation(id){


        try{


            setConversationId(id);



            setMessages([]);



            const oldMessages =

                await getMessages(id);



            setMessages(
                oldMessages || []
            );






            connectWebSocket(

                id,


                (newMessage)=>{


                    setMessages(

                        previous => [


                            ...previous,


                            newMessage


                        ]

                    );


                }


            );



        }
        catch(error){


            console.error(
                "Erreur ouverture conversation :",
                error
            );


        }


    }









    useEffect(()=>{


        loadConversations();



        return ()=>{


            disconnectWebSocket();


        };


    },[]);










    return (


        <ConversationContext.Provider


            value={



                {


                    conversations,


                    loadConversations,


                    conversationId,


                    messages,


                    openConversation,


                    setMessages



                }



            }



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