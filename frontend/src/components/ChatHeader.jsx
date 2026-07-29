import { useState } from "react";
import { useConversation } from "../context/ConversationContext";
import { useUsers } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

function ChatHeader({ onToggleSearch, isSearchOpen }){

    const {
        conversations = [],
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

    const currentConversation = conversations.find(
        conversation =>
            Number(conversation?.id) === Number(conversationId)
    );

    const otherUser = currentConversation?.users?.find(
        user =>
            Number(user?.id) !== Number(currentUser?.id)
    );

    /*
    ================================
    TYPING SECURE
    ================================
    */
    let typingText = "";
    if(typeof typingUser === "string"){
        typingText = typingUser;
    }
    else if(typingUser?.firstname){
        typingText = typingUser.firstname;
    }
    else if(typingUser?.email){
        typingText = typingUser.email;
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
                        otherUser.avatar ?
                        <img
                            src={`http://localhost:8081${otherUser.avatar}`}
                            alt="avatar"
                        />
                        :
                        otherUser.firstname ?
                        otherUser.firstname
                            .charAt(0)
                            .toUpperCase()
                        :
                        "?"
                    }
                </div>

                {
                    otherUser.online &&
                    <span className="online-dot"></span>
                }
            </div>
        );
    }

    return (
        <div className="chat-header">

            <div className="header-user">
                <Avatar />

                <div className="header-info">
                    <h3>
                        {
                            otherUser
                            ?
                            `${otherUser.firstname ?? ""} ${otherUser.lastname ?? ""}`
                            :
                            "Sélectionnez une conversation"
                        }
                    </h3>

                    {
                        otherUser &&
                        (
                            typingText !== ""
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
                    className={`header-button ${isSearchOpen ? 'active' : ''}`}
                    title="Recherche"
                    onClick={onToggleSearch}
                >
                    🔍
                </button>

                <button
                    className="header-button"
                    title="Changer thème"
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
                    title="Menu"
                >
                    ⋮
                </button>

            </div>

        </div>
    );
}

export default ChatHeader;