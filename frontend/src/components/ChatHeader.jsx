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

        conversationId


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

        currentConversation?.users.find(


            user =>


                user.id !== currentUser?.id


        );








    return (



        <div className="chat-header">






            <div className="avatar">


                {

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



                <span>

                    🟢 En ligne

                </span>


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