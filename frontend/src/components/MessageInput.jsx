import {
    useState
} from "react";


import {
    useConversation
} from "../context/ConversationContext";


import {
    sendMessage
} from "../services/websocket";





function MessageInput(){



    const [content,setContent] =
        useState("");





    const {
        conversationId
    } = useConversation();









    function handleSend(){



        if(!content.trim()){

            return;

        }




        if(!conversationId){

            console.log(
                "Aucune conversation"
            );

            return;

        }







        sendMessage(

            conversationId,

            content

        );




        setContent("");



    }










    function handleKeyDown(e){



        if(e.key==="Enter"){


            handleSend();


        }


    }









    return (


        <div className="message-input">


            <input


                type="text"


                placeholder="Écrire un message..."


                value={content}



                onChange={
                    e=>
                    setContent(
                        e.target.value
                    )
                }



                onKeyDown={
                    handleKeyDown
                }



            />






            <button

                onClick={
                    handleSend
                }

            >

                Envoyer

            </button>




        </div>


    );


}



export default MessageInput;