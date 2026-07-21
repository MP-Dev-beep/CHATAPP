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
        message.senderId === user?.id;







    function formatTime(date){


        if(!date){

            return "";

        }


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



        if(!isMine){

            return null;

        }





        /*
            Message envoyé
            ✓
        */


        if(
            !message.delivered
        ){

            return (

                <span className="status sent">

                    ✓

                </span>

            );

        }







        /*
            Message reçu
            ✓✓ gris
        */


        if(
            message.delivered
            &&
            !message.read
        ){

            return (

                <span className="status delivered">

                    ✓✓

                </span>

            );

        }







        /*
            Message lu
            ✓✓ bleu
        */


        if(
            message.read
        ){

            return (

                <span className="status read">

                    ✓✓

                </span>

            );

        }



    }








    return (



        <div

            className={

                isMine

                ?

                "message my-message"

                :

                "message other-message"

            }

        >



            <p>

                {message.content}

            </p>





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


    );



}



export default MessageBubble;