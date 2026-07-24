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
        ==================================
            MESSAGE ENVOYE
            ✓
        ==================================
        */



        if(!message.delivered){



            return (


                <span className="status sent">


                    ✓


                </span>


            );


        }









        /*
        ==================================
            MESSAGE LIVRE
            ✓✓ GRIS
        ==================================
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
        ==================================
            MESSAGE LU
            ✓✓ BLEU
        ==================================
        */



        if(message.read){



            return (


                <span className="status read">


                    ✓✓


                </span>


            );


        }





        return null;


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






            <div className="bubble">



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







        </div>



    );



}



export default MessageBubble;