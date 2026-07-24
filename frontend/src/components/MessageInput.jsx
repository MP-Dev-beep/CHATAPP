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





function MessageInput(){



    const [
        content,
        setContent
    ] = useState("");




    const {

        conversationId

    } = useConversation();








    function handleChange(value){


        setContent(value);



        if(conversationId){


            sendTyping(
                conversationId
            );


        }


    }








    function handleSend(){



        if(
            !content.trim()
            ||
            !conversationId
        ){

            return;

        }





        sendMessage(


            conversationId,


            content.trim()


        );





        setContent("");



    }








    return (


        <div className="message-input">





            <input



                value={content}



                placeholder="Écrire un message..."



                onChange={

                    e=>

                    handleChange(
                        e.target.value
                    )

                }




                onKeyDown={

                    e=>{


                        if(
                            e.key==="Enter"
                        ){

                            handleSend();

                        }


                    }

                }



            />







            <button

                onClick={handleSend}

            >

                Envoyer

            </button>






        </div>


    );


}



export default MessageInput;