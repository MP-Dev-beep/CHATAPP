import {
    useTheme
} from "../context/ThemeContext";



function ChatHeader(){



    const {
        dark,
        toggleTheme
    } = useTheme();





    return (


        <div className="chat-header">



            <div className="avatar">

                J

            </div>




            <div>

                <h3>

                    Jean

                </h3>


                <span>

                    🟢 En ligne

                </span>


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