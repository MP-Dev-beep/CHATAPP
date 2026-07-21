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





    const bottomRef =
        useRef();







    useEffect(()=>{


        bottomRef.current?.scrollIntoView({

            behavior:"smooth"

        });


    },[messages]);









    return (



        <div className="messages">





            {

            messages.length===0 ?


            (

                <p>

                    Aucun message

                </p>

            )


            :



            messages.map(message=>(



                <MessageBubble


                    key={message.id}


                    message={message}


                />



            ))



            }








            <div ref={bottomRef}/>






        </div>


    );


}



export default MessageList;