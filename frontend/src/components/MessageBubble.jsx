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


            return <span className="status sent">
                ✓
            </span>;

        }





        if(
            message.delivered
            &&
            !message.read
        ){


            return <span className="status delivered">
                ✓✓
            </span>;

        }







        if(message.read){


            return <span className="status read">
                ✓✓
            </span>;

        }



        return null;


    }









    return(



        <div



            className={

                isMine

                ?

                "message my-message"

                :

                "message other-message"

            }



        >







            <div className="bubble">







                {
                message.content &&


                <p>

                    {message.content}


                </p>

                }








                {
                message.fileType==="IMAGE" &&


                <img


                    src={

                        "http://localhost:8081"

                        +

                        message.fileUrl

                    }


                    className="message-image"


                    alt={message.fileName}


                />

                }









                {
                message.fileType==="VIDEO" &&


                <video

                    controls

                    className="message-video"


                >

                    <source

                        src={
                            "http://localhost:8081"
                            +
                            message.fileUrl
                        }

                    />


                </video>


                }








                {
                message.fileType==="DOCUMENT" &&


                <a

                    href={
                        "http://localhost:8081"
                        +
                        message.fileUrl
                    }


                    target="_blank"

                >

                    📄 {message.fileName}


                </a>


                }








                <div className="message-info">



                    <span>


                        {
                        formatTime(
                            message.sentAt
                        )
                        }


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