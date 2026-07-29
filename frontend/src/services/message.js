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

export async function updateMessage(messageId, content) {
    const response = await api.put(
        `/messages/${messageId}`,
        { content }
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

export async function searchMessages(conversationId, query) {
    const response = await api.get(
        `/messages/conversation/${conversationId}/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
}