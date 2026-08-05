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
    createConversation,
    archiveConversation
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
        onlineUsers=[],
        users=[]
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



    const [
        showArchived,
        setShowArchived
    ] = useState(false);





    const currentUserId =
        Number(
            localStorage.getItem(
                "userId"
            )
        );








    useEffect(()=>{


        loadConversations();



        function refresh(){

            loadConversations();

        }



        window.addEventListener(
            "profileUpdated",
            refresh
        );



        return ()=>{


            window.removeEventListener(
                "profileUpdated",
                refresh
            );


        };


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

            u=>

            Number(u.id)
            !==
            currentUserId

        );


    }









    function avatarUrl(value){


        if(!value){

            return null;

        }



        const url =
            value.startsWith("http")

            ?

            value

            :

            `http://localhost:8081${value}`;



        return (
            url
            +
            "?t="
            +
            Date.now()
        );


    }









    function isOnline(user){


        if(!user){

            return false;

        }



        return onlineUsers.includes(
            user.email
        );


    }









    async function startConversation(id){


        try{


            const conversation =
                await createConversation(
                    id
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
                error
            );


        }


    }









    async function handleSearch(value){


        setSearchText(value);



        if(
            value.trim()===""
        ){

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
                error
            );


        }


    }









    async function handleArchive(e,id){


        e.stopPropagation();


        try{


            await archiveConversation(
                id
            );


            await loadConversations();


        }
        catch(error){


            console.error(
                error
            );


        }


    }









    function Avatar({user}){


        return (

            <div className="contact-avatar">


                {

                    user?.avatar

                    ?

                    <img

                        src={
                            avatarUrl(
                                user.avatar
                            )
                        }

                        alt="avatar"

                    />

                    :

                    user?.firstname

                    ?

                    user.firstname
                    .charAt(0)
                    .toUpperCase()

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

                    onClick={
                        ()=>setShowProfile(false)
                    }

                >

                    ← Retour

                </button>



                <Profile/>


            </div>

        );


    }








    const filtered =
        conversations.filter(

            conv=>

            showArchived

            ?

            conv.isArchived

            :

            !conv.isArchived


        );









    return (


        <aside className="sidebar">



            <div className="sidebar-top">


                <h2>
                    ChatApp
                </h2>




                <div className="sidebar-actions">


                    <button

                        onClick={
                            ()=>setShowProfile(true)
                        }

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









            <div className="conversation-list">


            {

                filtered.map(conv=>{


                    const other =
                        getOtherUser(conv);



                    return (

                        <div

                            className="conversation-item"

                            key={conv.id}

                            onClick={
                                ()=>openConversation(
                                    conv.id
                                )
                            }

                        >



                            <Avatar user={other}/>



                            <div className="conversation-info">


                                <strong>


                                    {other?.firstname}

                                    {" "}

                                    {other?.lastname}


                                </strong>



                                <small>


                                    {
                                        conv.lastMessage
                                        ||
                                        "Nouvelle discussion"
                                    }


                                </small>



                            </div>





                            {

                            conv.unreadCount>0

                            &&

                            <span className="unread-badge">

                                {conv.unreadCount}

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