import {
    useUsers
} from "../context/UserContext";



function MessageBubble({

    message

}){



    const {
        user
    } = useUsers();





    const myMessage =

        user &&
        message.senderId === user.id;






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


                    message.status

                    &&


                    ` ${message.status}`


                }



            </small>



        </div>



    );



}


export default MessageBubble;