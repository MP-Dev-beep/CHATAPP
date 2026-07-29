import { useState, useRef, useEffect } from "react";
import {
    useUsers
} from "../context/UserContext";

import {
    useConversation
} from "../context/ConversationContext";

import {
    deleteMessage,
    updateMessage
} from "../services/message";

function MessageBubble({
    message,
    onDelete,
    onUpdate
}){

    const {
        user
    } = useUsers();

    const {
        setReplyMessage,
        setMessages
    } = useConversation();

    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(message?.content || "");
    const menuRef = useRef(null);

    // Sécurité fatale : si le message n'existe pas, on ne rend rien du tout
    if (!message) return null;

    const isMine =
        Number(message.senderId)
        ===
        Number(user?.id);

    // Fermer le menu si on clique en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            try {
                if (menuRef.current && !menuRef.current.contains(event.target)) {
                    setShowMenu(false);
                }
            } catch (e) {
                // Ignore
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function formatTime(date){
        try {
            if(!date) return "";
            return new Date(date).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
        } catch (e) {
            return "";
        }
    }

    function handleReply(){
        try {
            setReplyMessage({
                id: message.id,
                content: message.content || message.fileName || "Fichier"
            });
            setShowMenu(false);
        } catch (e) {
            console.error(e);
        }
    }

    async function handleDelete(deleteForEveryone) {
        const confirmMsg = deleteForEveryone 
            ? "Voulez-vous supprimer ce message pour tout le monde ?" 
            : "Voulez-vous supprimer ce message pour vous ?";

        if (window.confirm(confirmMsg)) {
            try {
                await deleteMessage(message.id, deleteForEveryone);
                
                if (typeof onDelete === "function") {
                    onDelete(message.id, deleteForEveryone);
                }
            } catch (error) {
                console.error("Erreur lors de la suppression du message", error);
                alert(error.response?.data?.message || "Impossible de supprimer le message");
            }
        }
        setShowMenu(false);
    }

    async function handleSaveEdit(e) {
        e.preventDefault();
        if (!editContent.trim()) return;
        try {
            // 1. Appel de l'API de modification
            const updated = await updateMessage(message.id, editContent);
            setIsEditing(false);

            // 2. Mise à jour instantanée dans le state global du contexte
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === updated.id ? updated : msg
                )
            );

            // 3. Appel de la prop onUpdate si elle est fournie par le parent
            if (typeof onUpdate === "function") {
                onUpdate(updated);
            }
        } catch (error) {
            console.error("Erreur modification message", error);
            alert("Impossible de modifier le message");
        }
    }

    function goToReplyMessage(){
        try {
            if(!message.replyToId) return;
            const element = document.getElementById(`message-${message.replyToId}`);
            if(element){
                element.scrollIntoView({ behavior:"smooth", block:"center" });
                element.classList.add("highlight-message");
                setTimeout(()=>{
                    element.classList.remove("highlight-message");
                },1500);
            }
        } catch (e) {
            console.error(e);
        }
    }

    function renderStatus(){
        try {
            if(!isMine) return null;
            if(!message.delivered) return <span className="message-status sent">✓</span>;
            if(message.delivered && !message.read) return <span className="message-status delivered">✓✓</span>;
            if(message.read) return <span className="message-status read">✓✓</span>;
            return null;
        } catch (e) {
            return null;
        }
    }

    const fileUrl = message.fileUrl ? "http://localhost:8081" + message.fileUrl : null;
    const isDeleted = message.content === "Ce message a été supprimé";

    return (
        <div
            id={`message-${message.id}`}
            className={isMine ? "message-row mine" : "message-row"}
        >
            <div className="message-bubble" style={{ position: 'relative' }}>

                {/* Bouton des trois points verticaux (⋮) en haut à droite (masqué si le message est déjà supprimé) */}
                {!isDeleted && !isEditing && (
                    <div className="message-menu-container" ref={menuRef} style={{ position: 'absolute', top: '5px', right: '8px', zIndex: 5 }}>
                        <button 
                            className="menu-trigger-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(prev => !prev);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', color: '#666' }}
                            title="Options"
                        >
                            ⋮
                        </button>

                        {showMenu && (
                            <div className="message-dropdown-menu" style={{
                                position: 'absolute',
                                right: '0',
                                top: '20px',
                                background: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: '160px'
                            }}>
                                <button onClick={handleReply} style={{ padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px' }}>
                                    ↩️ Répondre
                                </button>

                                {/* Si c'est mon message ET qu'il n'a pas encore été lu : on peut supprimer pour tout le monde */}
                                {isMine && !message.read && (
                                    <button onClick={() => handleDelete(true)} style={{ padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: 'red' }}>
                                        🗑️ Suppr. pour tous
                                    </button>
                                )}

                                {/* Option de suppression pour soi (disponible pour tous les messages) */}
                                <button onClick={() => handleDelete(false)} style={{ padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: 'orange' }}>
                                    🗑️ Supprimer pour moi
                                </button>

                                {isMine && message.content && (
                                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} style={{ padding: '8px 12px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px' }}>
                                        ✏️ Modifier
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {message.replyToId && !isDeleted && (
                    <div
                        className="reply-preview"
                        onClick={goToReplyMessage}
                        style={{ cursor:"pointer", marginTop: '15px' }}
                    >
                        <span>↩ Réponse à :</span>
                        <p>
                            {
                                message.replyMessage?.content
                                || message.replyContent
                                || "Message supprimé"
                            }
                        </p>
                    </div>
                )}

                {isDeleted ? (
                    <p className="message-text" style={{ fontStyle: 'italic', color: '#888', marginTop: message.replyToId ? '5px' : '10px' }}>
                        🚫 Ce message a été supprimé
                    </p>
                ) : isEditing ? (
                    <form onSubmit={handleSaveEdit} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <input
                            type="text"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setIsEditing(false)} style={{ fontSize: '11px', padding: '2px 6px' }}>Annuler</button>
                            <button type="submit" style={{ fontSize: '11px', padding: '2px 6px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>Enregistrer</button>
                        </div>
                    </form>
                ) : (
                    <>
                        {message.content && (
                            <p className="message-text" style={{ marginTop: message.replyToId ? '5px' : '15px', paddingRight: '15px' }}>
                                {message.content}
                                {(message.isEdited || message.edited) && (
                                    <span style={{ fontSize: '10px', fontStyle: 'italic', color: '#888', marginLeft: '5px' }}>
                                        (modifié)
                                    </span>
                                )}
                            </p>
                        )}

                        {message.fileType === "IMAGE" && <img src={fileUrl} alt={message.fileName || ""} className="chat-image" />}
                        {message.fileType === "VIDEO" && <video controls className="chat-video"><source src={fileUrl} /></video>}
                        {message.fileType === "AUDIO" && <audio controls className="chat-audio"><source src={fileUrl} /></audio>}
                        {(message.fileType === "DOCUMENT" || message.fileType === "PDF") && (
                            <a href={fileUrl} target="_blank" rel="noreferrer" className="chat-document">
                                📄 <span>{message.fileName}</span>
                            </a>
                        )}
                    </>
                )}

                <div className="message-footer">
                    <span>{formatTime(message.sentAt)}</span>
                    {renderStatus()}
                </div>

            </div>
        </div>
    );
}

export default MessageBubble;