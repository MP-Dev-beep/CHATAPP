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

        messages = []

    } = useConversation();




    const messagesEndRef = useRef();







    useEffect(()=>{


        messagesEndRef.current?.scrollIntoView({

            behavior:"smooth"

        });


    },[messages]);







    return (



        <div className="messages">





            {

                (messages || []).length === 0 ? (


                    <p className="empty-chat">

                        Aucun message

                    </p>


                ) : (


                    (messages || []).map(message=>(


                        <MessageBubble


                            key={message.id}


                            message={message}


                        />


                    ))


                )



            }






            <div ref={messagesEndRef}/>



        </div>



    );


}



export default MessageList;