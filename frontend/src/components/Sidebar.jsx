import {
    useEffect,
    useState
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


import Profile from "../pages/Profile";





function Sidebar(){



    const {

        conversations = [],

        loadConversations,

        openConversation


    } = useConversation();






    const {

        search,

        onlineUsers = []

    } = useUsers();








    const [
        searchText,
        setSearchText
    ] = useState("");





    const [
        results,
        setResults
    ] = useState([]);





    const [
        showProfile,
        setShowProfile
    ] = useState(false);







    const currentUserId =

        Number(
            localStorage.getItem("userId")
        );








    useEffect(()=>{


        loadConversations();


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


        return conversation.users?.find(

            user =>

            user.id !== currentUserId

        );


    }









    function isOnline(user){


        if(!user)

            return false;



        return onlineUsers.includes(
            user.email
        );


    }









    async function startConversation(userId){


        try{


            const conversation =

                await createConversation(
                    userId
                );




            await loadConversations();




            openConversation(
                conversation.id
            );



            setResults([]);

            setSearchText("");



        }
        catch(error){


            console.error(
                "Erreur création conversation",
                error
            );


        }


    }









    async function handleSearch(value){


        setSearchText(value);



        if(value.trim()===""){


            setResults([]);

            return;


        }




        try{


            const data =

                await search(value);



            setResults(
                data || []
            );


        }
        catch(error){


            console.error(
                "Erreur recherche",
                error
            );


        }


    }









    function Avatar({user}){


        return (

            <div className="avatar">


                {

                user?.avatar ?


                <img

                    src={
                        `http://localhost:8081${user.avatar}`
                    }

                    alt="avatar"

                />


                :


                user?.firstname

                ?

                user.firstname.charAt(0)


                :

                "?"

                }


            </div>

        );


    }









    if(showProfile){


        return (


            <div className="sidebar">


                <button

                    onClick={
                        ()=>setShowProfile(false)
                    }

                >

                    ← Retour

                </button>



                <Profile />


            </div>


        );


    }









    return (


        <div className="sidebar">



            <h2>

                ChatApp

            </h2>







            <button

                onClick={
                    ()=>setShowProfile(true)
                }

            >

                👤 Mon profil

            </button>







            <button

                onClick={logout}

            >

                Déconnexion

            </button>









            <input


                className="search-input"


                placeholder="Rechercher un utilisateur..."


                value={searchText}



                onChange={

                    e=>

                    handleSearch(
                        e.target.value
                    )

                }


            />









            {
            
            results.length > 0 &&

            <>


            <h3>

                Résultats

            </h3>






            {

            results.map(user=>(



                <div


                    className="contact"


                    key={user.id}


                    onClick={

                        ()=>startConversation(
                            user.id
                        )

                    }


                >



                    <Avatar user={user}/>





                    <div>


                        <strong>

                            {user.firstname}

                            {" "}

                            {user.lastname}


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

                            Nouvelle discussion

                        </p>



                    </div>



                </div>



            ))


            }



            </>


            }












            <h3>

                Conversations

            </h3>









            {

            conversations.length === 0 &&


            <p>

                Aucune conversation

            </p>


            }









            {


            conversations.map(conversation=>{


                const user =

                    getOtherUser(
                        conversation
                    );




                return (



                    <div


                        className="contact"


                        key={conversation.id}


                        onClick={

                            ()=>openConversation(
                                conversation.id
                            )

                        }


                    >





                        <Avatar user={user}/>








                        <div>


                            <strong>


                                {user?.firstname}

                                {" "}

                                {user?.lastname}


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






                                {


                                conversation.unreadCount > 0 &&



                                <span className="badge">


                                    {

                                    conversation.unreadCount

                                    }


                                </span>


                                }



                            </p>





                        </div>





                    </div>



                );


            })


            }




        </div>


    );


}



export default Sidebar;