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

        fetchUsers,

        user: currentUser


    } = useUsers();







    useEffect(()=>{


        loadConversations();

        fetchUsers();


    },[]);









    function logout(){


        localStorage.removeItem("token");

        localStorage.removeItem("userId");


        window.location.reload();


    }









    function getOtherUser(conversation){



        return conversation.users.find(


            u =>

            u.id !== currentUser?.id


        );


    }









    function hasConversation(userId){



        return conversations.some(


            conversation =>


                conversation.users.some(

                    u => u.id === userId

                )


        );


    }









    async function startConversation(userId){



        try {



            const conversation =

                await createConversation(userId);




            await loadConversations();




            openConversation(

                conversation.id

            );



        } catch(error){


            console.error(

                "Erreur création conversation",

                error

            );


        }


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

            conversations.map(conversation=>{


                const user =

                    getOtherUser(conversation);




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



            })

            }












            <h3>

                Nouveaux contacts

            </h3>









            {


            users

            .filter(

                u =>

                u.id !== currentUser?.id

            )

            .filter(

                u =>

                !hasConversation(u.id)

            )


            .map(user=>(





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