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

        conversations=[],

        loadConversations,

        openConversation


    } = useConversation();







    const {

        search,

        onlineUsers=[]


    } = useUsers();









    const [searchText,setSearchText]=useState("");

    const [results,setResults]=useState([]);

    const [showProfile,setShowProfile]=useState(false);









    const currentUserId =

        Number(

            localStorage.getItem("userId")

        );









    useEffect(()=>{


        loadConversations();


    },[]);









    function logout(){



        localStorage.removeItem("token");

        localStorage.removeItem("userId");


        window.location.reload();


    }









    function getOtherUser(conversation){



        return conversation.users?.find(

            user=>

            user.id!==currentUserId

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


            const conversation=

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


            console.error(error);


        }


    }









    async function handleSearch(value){



        setSearchText(value);




        if(value.trim()===""){


            setResults([]);


            return;


        }





        try{


            const data=

                await search(value);



            setResults(data || []);


        }

        catch(error){


            console.error(error);


        }


    }









    function Avatar({user}){


        return (

            <div className="contact-avatar">


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





                {

                isOnline(user)

                &&

                <span className="online-dot"/>

                }



            </div>

        );


    }









    if(showProfile){


        return (

            <div className="sidebar">


                <button

                    className="back-button"

                    onClick={()=>setShowProfile(false)}

                >

                    ← Retour

                </button>



                <Profile/>


            </div>

        );


    }









    return (


        <aside className="sidebar">






            <div className="sidebar-top">



                <h2>

                    ChatApp

                </h2>





                <div className="sidebar-actions">


                    <button

                        onClick={()=>setShowProfile(true)}

                    >

                        👤

                    </button>



                    <button

                        onClick={logout}

                    >

                        🚪

                    </button>


                </div>


            </div>









            <div className="search-box">


                🔍


                <input


                    value={searchText}


                    placeholder="Rechercher..."


                    onChange={

                        e=>

                        handleSearch(

                            e.target.value

                        )

                    }


                />


            </div>









            {


            results.length>0 &&


            <div className="search-results">


                <h4>

                    Résultats

                </h4>



                {

                results.map(user=>(



                    <div


                        className="conversation-item"


                        key={user.id}


                        onClick={()=>startConversation(user.id)}

                    >



                        <Avatar user={user}/>



                        <div>


                            <strong>

                                {user.firstname}

                                {" "}

                                {user.lastname}

                            </strong>


                            <small>

                                Nouvelle discussion

                            </small>


                        </div>


                    </div>



                ))



                }


            </div>


            }









            <h3 className="section-title">

                Conversations

            </h3>









            <div className="conversation-list">



            {


            conversations.length===0 &&


            <p>

                Aucune conversation

            </p>


            }









            {


            conversations.map(conversation=>{


                const user=

                    getOtherUser(conversation);



                return (



                    <div


                        className="conversation-item"


                        key={conversation.id}


                        onClick={()=>openConversation(conversation.id)}

                    >



                        <Avatar user={user}/>





                        <div className="conversation-info">


                            <strong>


                                {user?.firstname}

                                {" "}

                                {user?.lastname}


                            </strong>





                            <small>


                                {

                                conversation.lastMessage

                                ||

                                "Nouvelle discussion"

                                }


                            </small>



                        </div>








                        {


                        conversation.unreadCount>0

                        &&


                        <span className="unread-badge">


                            {conversation.unreadCount}


                        </span>


                        }




                    </div>


                );


            })


            }



            </div>






        </aside>


    );


}


export default Sidebar;