import api from "./api";

export async function getMessages(conversationId) {
    const response = await api.get(
        `/messages/conversation/${conversationId}`
    );
    return response.data;
}

export async function sendMessage(data) {
    const response = await api.post(
        "/messages",
        data
    );
    return response.data;
}

export async function markConversationRead(conversationId) {
    await api.put(
        `/messages/read/${conversationId}`
    );
}

export async function deleteMessage(messageId, deleteForEveryone = false) {
    const response = await api.delete(
        `/messages/${messageId}?deleteForEveryone=${deleteForEveryone}`
    );
    return response.data;
}