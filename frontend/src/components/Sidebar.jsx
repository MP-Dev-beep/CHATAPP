import {
    useEffect
} from "react";


import {
    useConversation
} from "../context/ConversationContext";


import {
    useUsers
} from "../context/UserContext";


import {
    createConversation
} from "../services/conversation";





function Sidebar(){



    const {
        conversations,
        loadConversations,
        openConversation
    } = useConversation();




    const {
        users,
        fetchUsers
    } = useUsers();






    useEffect(()=>{


        loadConversations();


        fetchUsers();


    },[]);








    function getOtherUser(conversation){


        const currentUserId =
            Number(
                localStorage.getItem("userId")
            );



        return conversation.users.find(

            user =>

                user.id !== currentUserId

        );


    }








    function logout(){


        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "userId"
        );



        window.location.reload();


    }









    return (


        <div className="sidebar">



            <h2>
                ChatApp
            </h2>




            <button
                onClick={logout}
            >

                Déconnexion

            </button>







            <h3>
                Conversations
            </h3>





            {

                conversations.map(

                    conversation => {



                        const user =
                            getOtherUser(
                                conversation
                            );



                        return (



                            <div

                                className="contact"

                                key={
                                    conversation.id
                                }


                                onClick={()=>


                                    openConversation(
                                        conversation.id
                                    )

                                }


                            >



                                <div className="avatar">


                                    {
                                        user?.firstname
                                        ?.charAt(0)
                                    }


                                </div>





                                <div>


                                    <strong>


                                        {
                                            user?.firstname
                                        }


                                        {" "}


                                        {
                                            user?.lastname
                                        }


                                    </strong>



                                    <p>

                                        Ouvrir la discussion

                                    </p>



                                </div>



                            </div>



                        );


                    }


                )


            }










            <h3>

                Nouveaux contacts

            </h3>







            {


                users.map(


                    user => (




                        <div


                            className="contact"


                            key={
                                user.id
                            }





                            onClick={async ()=>{


                                try {



                                    const response =

                                        await createConversation(

                                            user.id

                                        );





                                    await loadConversations();





                                    openConversation(

                                        response.id

                                    );



                                }



                                catch(error){



                                    console.error(

                                        "Erreur création conversation :",

                                        error

                                    );


                                }



                            }}



                        >





                            <div className="avatar">


                                {
                                    user.firstname
                                    ?.charAt(0)
                                }


                            </div>







                            <div>



                                <strong>


                                    {
                                        user.firstname
                                    }


                                    {" "}


                                    {
                                        user.lastname
                                    }


                                </strong>




                                <p>

                                    Nouvelle conversation

                                </p>



                            </div>





                        </div>




                    )


                )


            }







        </div>


    );


}




export default Sidebar;