import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";


import { ThemeProvider } 
from "./context/ThemeContext";


import { UserProvider } 
from "./context/UserContext";


import { ConversationProvider } 
from "./context/ConversationContext";


import "./styles/chat.css";



ReactDOM.createRoot(
    document.getElementById("root")
)
.render(


    <React.StrictMode>


        <ThemeProvider>


            <UserProvider>


                <ConversationProvider>


                    <App />


                </ConversationProvider>


            </UserProvider>


        </ThemeProvider>


    </React.StrictMode>


);