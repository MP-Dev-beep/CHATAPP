import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

import "../styles/chat.css";



function Chat(){


return (

<div className="chat-container">


<Sidebar />



<div className="chat-window">


<ChatHeader />



<MessageList />



<MessageInput />



</div>



</div>

);



}

export default Chat;