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

        conversations = [],
        loadConversations,
        openConversation

    } = useConversation();





    const {

        users = [],
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



        return conversation.users?.find(

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


        localStorage.removeItem(
            "firstname"
        );


        window.location.reload();


    }









    async function startConversation(userId){


        try{


            const response =

                await createConversation(

                    userId

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


    }









    function isAlreadyInConversation(userId){


        return conversations.some(

            conversation =>


                conversation.users?.some(

                    user =>

                        user.id === userId

                )


        );


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


                conversations.length === 0 ?


                (

                    <p>

                        Aucune conversation

                    </p>


                )


                :


                (


                    conversations.map(

                        conversation => {


                            const user =

                                getOtherUser(

                                    conversation

                                );



                            return (


                                <div


                                    className="contact"


                                    key={conversation.id}



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


                )


            }









            <h3>

                Nouveaux contacts

            </h3>









            {


                users

                .filter(user => {


                    const currentUserId =

                        Number(

                            localStorage.getItem("userId")

                        );



                    // Ne pas afficher l'utilisateur connecté

                    if(user.id === currentUserId){

                        return false;

                    }




                    // Ne pas afficher les personnes déjà en conversation

                    if(

                        isAlreadyInConversation(

                            user.id

                        )

                    ){

                        return false;

                    }




                    return true;


                })



                .map(user => (



                    <div


                        className="contact"


                        key={user.id}



                        onClick={()=>


                            startConversation(

                                user.id

                            )


                        }


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



                ))



            }








        </div>


    );


}



export default Sidebar;