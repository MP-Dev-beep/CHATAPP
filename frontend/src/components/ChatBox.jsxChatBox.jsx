import {
    useState
} from "react";


import {
    useConversation
} from "../context/ConversationContext";


import {
    sendMessage,
    sendTyping
} from "../services/websocket";





function ChatBox(){



    const {

        messages,

        conversationId,

    } = useConversation();





    const [content,setContent] = useState("");








    function handleSend(){



        if(!content.trim()){

            return;

        }



        if(!conversationId){

            return;

        }





        sendMessage(

            conversationId,

            content

        );




        setContent("");



    }








    function handleTyping(){



        if(conversationId){


            sendTyping(
                conversationId
            );


        }



    }









    return (


        <div className="chat-box">






            <div className="messages">



                {


                messages.map(message=>(


                    <div

                        key={message.id}

                        className={
                            message.senderId
                            ? "message"
                            : "message"
                        }

                    >



                        <p>

                            {message.content}

                        </p>





                        <small>


                            {


                            message.delivered &&

                            !message.read

                            ?

                            "✓✓"

                            :

                            ""

                            }




                            {


                            message.read

                            ?

                            " ✓✓"

                            :

                            ""

                            }



                        </small>



                    </div>



                ))



                }



            </div>









            <div className="input-zone">



                <input


                    value={content}


                    onChange={(e)=>{


                        setContent(
                            e.target.value
                        );


                        handleTyping();


                    }}


                    placeholder="Votre message..."



                    onKeyDown={(e)=>{


                        if(e.key==="Enter"){


                            handleSend();


                        }


                    }}



                />





                <button

                    onClick={handleSend}

                >


                    Envoyer


                </button>



            </div>






        </div>


    );



}



export default ChatBox;