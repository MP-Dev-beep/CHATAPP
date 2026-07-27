import {
    useUsers
} from "../context/UserContext";




function MessageBubble({

    message

}){



    const {

        user

    } = useUsers();







    const isMine =

        Number(message.senderId)

        ===

        Number(user?.id);









    function formatTime(date){


        if(!date)

            return "";



        return new Date(date)

            .toLocaleTimeString(

                [],

                {

                    hour:"2-digit",

                    minute:"2-digit"

                }

            );


    }









    function renderStatus(){



        if(!isMine)

            return null;







        if(!message.delivered){


            return (

                <span className="message-status sent">

                    ✓

                </span>

            );


        }









        if(

            message.delivered

            &&

            !message.read

        ){


            return (

                <span className="message-status delivered">

                    ✓✓

                </span>

            );


        }








        if(message.read){


            return (

                <span className="message-status read">

                    ✓✓

                </span>

            );


        }



        return null;


    }









    const fileUrl =

        message.fileUrl

        ?

        "http://localhost:8081"

        +

        message.fileUrl

        :

        null;









    return (



        <div


            className={

                isMine

                ?

                "message-row mine"

                :

                "message-row"

            }


        >








            <div className="message-bubble">







                {

                message.content &&



                <p className="message-text">


                    {message.content}


                </p>


                }









                {


                message.fileType==="IMAGE"

                &&


                <img

                    src={fileUrl}

                    alt={message.fileName}

                    className="chat-image"

                />


                }









                {


                message.fileType==="VIDEO"

                &&


                <video

                    controls

                    className="chat-video"

                >

                    <source

                        src={fileUrl}

                    />

                </video>


                }









                {


                message.fileType==="AUDIO"

                &&


                <audio

                    controls

                    className="chat-audio"

                >

                    <source

                        src={fileUrl}

                    />


                </audio>


                }









                {


                (

                    message.fileType==="DOCUMENT"

                    ||

                    message.fileType==="PDF"

                )

                &&


                <a

                    href={fileUrl}

                    target="_blank"

                    rel="noreferrer"

                    className="chat-document"

                >

                    📄

                    <span>

                        {message.fileName}

                    </span>


                </a>


                }









                <div className="message-footer">


                    <span>

                        {formatTime(message.sentAt)}

                    </span>




                    {

                        renderStatus()

                    }


                </div>








            </div>







        </div>


    );



}



export default MessageBubble;