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


import {
    uploadFile
} from "../services/api";







function MessageInput(){



    const [
        content,
        setContent
    ] = useState("");




    const [
        file,
        setFile
    ] = useState(null);





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









    async function handleSend(){



        if(!conversationId){

            return;

        }







        let fileName=null;

        let fileType=null;

        let fileUrl=null;









        /*
        ===============================
        UPLOAD AVANT ENVOI MESSAGE
        ===============================
        */


        if(file){



            try{


                const uploaded = await uploadFile(
                    file
                );




                fileName =
                    uploaded.fileName;



                fileType =
                    uploaded.fileType;



                fileUrl =
                    uploaded.fileUrl;



            }

            catch(error){


                console.error(
                    "UPLOAD ERROR",
                    error
                );


                return;


            }


        }









        if(

            !content.trim()

            &&

            !fileUrl

        ){

            return;

        }









        /*
        ===============================
        WEBSOCKET
        ===============================
        */


        sendMessage(


            conversationId,


            content.trim(),


            fileName,


            fileType,


            fileUrl



        );








        setContent("");

        setFile(null);



    }












    return(


        <div className="message-input">





            <input


                type="file"


                onChange={

                    e=>

                    setFile(
                        e.target.files[0]
                    )

                }


            />









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