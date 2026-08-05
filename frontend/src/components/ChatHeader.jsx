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
    useTheme
} from "../context/ThemeContext";




function ChatHeader({
    onToggleSearch,
    isSearchOpen
}){


    const {
        conversations=[],
        conversationId,
        typingUser
    } = useConversation();



    const {
        user:currentUser,
        users=[]
    } = useUsers();




    const {
        dark,
        toggleTheme
    } = useTheme();





    const [
        refresh,
        setRefresh
    ] = useState(0);






    useEffect(()=>{


        function update(){

            setRefresh(
                value=>value+1
            );

        }



        window.addEventListener(
            "profileUpdated",
            update
        );



        return ()=>{


            window.removeEventListener(
                "profileUpdated",
                update
            );


        };


    },[]);










    const currentConversation =
        conversations.find(

            conv=>

            Number(conv.id)
            ===
            Number(conversationId)

        );










    let otherUser =
        currentConversation?.users?.find(

            u=>

            Number(u.id)
            !==
            Number(currentUser?.id)

        );





    if(otherUser){


        const fresh =
            users.find(

                u=>

                Number(u.id)
                ===
                Number(otherUser.id)

            );



        if(fresh){


            otherUser={

                ...otherUser,

                ...fresh

            };


        }


    }









    function getAvatar(value){


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









    let typingText="";



    if(typeof typingUser==="string"){


        typingText =
            typingUser;


    }
    else if(typingUser?.firstname){


        typingText =
            typingUser.firstname;


    }
    else if(typingUser?.email){


        typingText =
            typingUser.email;


    }









    function Avatar(){



        if(!otherUser){


            return (

                <div className="avatar chat-avatar">

                    ?

                </div>

            );


        }






        return (

            <div className="header-avatar-wrapper">


                <div className="avatar chat-avatar">


                {

                    getAvatar(
                        otherUser.avatar
                    )

                    ?

                    <img

                        src={
                            getAvatar(
                                otherUser.avatar
                            )
                        }

                        alt="avatar"

                    />


                    :


                    otherUser.firstname

                    ?

                    otherUser.firstname
                    .charAt(0)
                    .toUpperCase()


                    :

                    "?"

                }


                </div>





                {

                    otherUser.online

                    &&

                    <span className="online-dot"/>


                }



            </div>

        );


    }









    return (

        <div className="chat-header">



            <div className="header-user">


                <Avatar/>




                <div className="header-info">



                    <h3>


                        {

                            otherUser

                            ?

                            `${otherUser.firstname || ""} ${otherUser.lastname || ""}`

                            :

                            "Sélectionnez une conversation"

                        }


                    </h3>







                    {

                    otherUser

                    &&

                    (

                        typingText

                        ?

                        <p className="typing">

                            ✍️ {typingText} est en train d'écrire...

                        </p>


                        :


                        <p className="online-status">


                            {

                                otherUser.online

                                ?

                                "🟢 En ligne"

                                :

                                "⚫ Hors ligne"


                            }


                        </p>

                    )


                    }





                </div>



            </div>








            <div className="header-actions">



                <button

                    className={
                        `header-button ${
                        isSearchOpen
                        ?
                        "active"
                        :
                        ""
                        }`
                    }

                    onClick={onToggleSearch}

                >

                    🔍

                </button>





                <button

                    className="header-button"

                    onClick={toggleTheme}

                >

                    {

                    dark

                    ?

                    "☀️"

                    :

                    "🌙"

                    }


                </button>






                <button

                    className="header-button"

                >

                    ⋮

                </button>




            </div>





        </div>

    );


}



export default ChatHeader;