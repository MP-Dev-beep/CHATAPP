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

        messages=[]

    } = useConversation();




    const bottomRef = useRef();





    useEffect(()=>{


        bottomRef.current?.scrollIntoView({

            behavior:"smooth"

        });


    },[messages]);





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
                    />


                </div>


            ))

            }



            <div ref={bottomRef}/>


        </div>


    );

}


export default MessageList;