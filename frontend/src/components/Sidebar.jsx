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
        onlineUsers=[]
    } = useUsers();

    const [searchText,setSearchText]=useState("");
    const [results,setResults]=useState([]);
    const [showProfile,setShowProfile]=useState(false);
    const [showArchived, setShowArchived] = useState(false);

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

    async function handleArchive(e, conversationId) {
        e.stopPropagation();
        try {
            await archiveConversation(conversationId);
            await loadConversations();
        } catch (error) {
            console.error("Erreur lors de l'archivage", error);
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

    const filteredConversations = conversations.filter(conv => {
        if (showArchived) return conv.isArchived;
        return !conv.isArchived;
    });

    return (
        <aside className="sidebar">

            <div className="sidebar-top">
                <h2>
                    ChatApp
                </h2>

                <div className="sidebar-actions">
                    <button
                        onClick={()=>setShowProfile(true)}
                        title="Profil"
                    >
                        👤
                    </button>

                    <button
                        onClick={logout}
                        title="Déconnexion"
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

            <div className="sidebar-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '15px 10px 5px 10px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>
                    {showArchived ? "Archivées" : "Conversations"}
                </h3>
                <button 
                    onClick={() => setShowArchived(!showArchived)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#007bff' }}
                >
                    {showArchived ? "Voir actives" : "📁 Archivées"}
                </button>
            </div>

            <div className="conversation-list">

            {
            filteredConversations.length===0 &&
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                {showArchived ? "Aucune conversation archivée" : "Aucune conversation"}
            </p>
            }

            {
            filteredConversations.map(conversation=>{
                const user=
                    getOtherUser(conversation);

                return (
                    <div
                        className="conversation-item"
                        key={conversation.id}
                        onClick={()=>openConversation(conversation.id)}
                        style={{ position: 'relative' }}
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <button
                                onClick={(e) => handleArchive(e, conversation.id)}
                                title={conversation.isArchived ? "Désarchiver" : "Archiver"}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                            >
                                {conversation.isArchived ? "📂" : "📥"}
                            </button>

                            {
                            conversation.unreadCount>0
                            &&
                            <span className="unread-badge">
                                {conversation.unreadCount}
                            </span>
                            }
                        </div>

                    </div>
                );
            })
            }

            </div>

        </aside>
    );
}

export default Sidebar;