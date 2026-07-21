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

        fetchUsers,

        onlineUsers = []


    } = useUsers();









    const currentUserId =

        Number(
            localStorage.getItem("userId")
        );









    useEffect(()=>{


        loadConversations();

        fetchUsers();



    },[]);









    function logout(){


        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "userId"
        );


        window.location.reload();


    }









    function getOtherUser(conversation){


        if(!conversation?.users){

            return null;

        }



        return conversation.users.find(


            user =>

                user.id !== currentUserId


        );


    }









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









    function isOnline(user){


        if(!user){

            return false;

        }



        return Array.isArray(onlineUsers)

            &&

            onlineUsers.includes(
                user.email
            );


    }









    function hasConversation(userId){



        return conversations.some(


            conversation =>


                conversation.users?.some(


                    user =>

                        user.id === userId


                )


        );


    }









    async function startConversation(userId){


        try{


            const response =

                await createConversation(

                    {

                        userId

                    }

                );




            await loadConversations();




            openConversation(

                response.id

            );



        }

        catch(error){



            console.error(

                "Erreur création conversation",

                error

            );


        }



    }









    const sortedConversations =

        [...conversations].sort(

            (a,b)=>


                new Date(

                    b.lastMessageTime

                    ||

                    b.createdAt

                )

                -

                new Date(

                    a.lastMessageTime

                    ||

                    a.createdAt

                )

        );









    const newContacts =


        users.filter(


            user =>


                user.id !== currentUserId

                &&

                !hasConversation(

                    user.id

                )


        );









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

                sortedConversations.map(


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






                                    <span>


                                        {

                                            isOnline(user)

                                            ?

                                            " 🟢"

                                            :

                                            " ⚫"

                                        }



                                    </span>









                                    <p>


                                        {

                                            conversation.lastMessage

                                            ||

                                            "Nouvelle discussion"


                                        }



                                    </p>









                                    <small>


                                        {

                                            formatTime(

                                                conversation.lastMessageTime

                                            )

                                        }



                                    </small>





                                </div>







                            </div>



                        );


                    }


                )


            }













            {

                newContacts.length > 0 &&



                <>



                    <h3>

                        Nouveaux contacts

                    </h3>









                    {

                        newContacts.map(


                            user => (



                                <div


                                    className="contact"


                                    key={
                                        user.id
                                    }



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






                                        <span>


                                            {

                                                isOnline(user)

                                                ?

                                                " 🟢"

                                                :

                                                " ⚫"


                                            }



                                        </span>






                                        <p>

                                            Nouvelle conversation

                                        </p>






                                    </div>





                                </div>



                            )


                        )


                    }



                </>


            }






        </div>



    );


}



export default Sidebar;