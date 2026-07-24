import {
    useConversation
} from "../context/ConversationContext";


import {
    useUsers
} from "../context/UserContext";


import {
    useTheme
} from "../context/ThemeContext";






function ChatHeader(){



    const {

        conversations,

        conversationId,

        typingUser


    } = useConversation();







    const {

        user: currentUser


    } = useUsers();







    const {

        dark,

        toggleTheme


    } = useTheme();









    const currentConversation =

        conversations.find(

            conversation =>

                conversation.id === conversationId

        );









    const otherUser =

        currentConversation?.users?.find(

            user =>

                user.id !== currentUser?.id

        );









    return (


        <div className="chat-header">







            <div className="avatar">


                {


                otherUser?.avatar ?


                <img

                    src={
                        `http://localhost:8081${otherUser.avatar}`
                    }

                    alt="avatar"

                />


                :


                otherUser?.firstname

                ?

                otherUser.firstname.charAt(0)


                :

                "?"


                }


            </div>









            <div>



                <h3>


                    {


                    otherUser


                    ?


                    `${otherUser.firstname} ${otherUser.lastname}`


                    :


                    "Sélectionnez une conversation"


                    }


                </h3>









                {


                otherUser &&



                (



                    typingUser


                    ?



                    <p className="typing">


                        ✍️


                        {" "}


                        {typingUser}


                        {" est en train d'écrire..."}



                    </p>




                    :



                    <span>


                        {


                        otherUser.online


                        ?


                        "🟢 En ligne"


                        :


                        "⚫ Hors ligne"


                        }



                    </span>




                )



                }





            </div>











            <button

                className="theme-button"

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





        </div>


    );


}



export default ChatHeader;