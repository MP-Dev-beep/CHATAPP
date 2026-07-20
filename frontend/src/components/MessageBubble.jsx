function MessageBubble({

    message

}){



    const myMessage =

        Number(message.senderId)

        ===

        Number(
            localStorage.getItem("userId")
        );






    return (


        <div


            className={

                myMessage

                ?

                "message my-message"

                :

                "message other-message"


            }



        >



            <div>


                {message.content}


            </div>





            <small>


                {

                    message.sentAt

                    ?

                    new Date(
                        message.sentAt
                    )
                    .toLocaleTimeString(

                        [],

                        {

                            hour:"2-digit",

                            minute:"2-digit"

                        }

                    )


                    :

                    ""

                }



                {

                    myMessage

                    ?

                    " ENVOYÉ"

                    :

                    " REÇU"

                }



            </small>





        </div>


    );


}


export default MessageBubble;