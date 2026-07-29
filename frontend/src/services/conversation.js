import api from "./api";

export async function getConversations(){
    const response = await api.get(
        "/conversations"
    );
    return response.data;
}

export async function createConversation(userId){
    const response = await api.post(
        "/conversations",
        {
            userId
        }
    );
    return response.data;
}

export async function archiveConversation(conversationId){
    const response = await api.put(
        `/conversations/${conversationId}/archive`
    );
    return response.data;
}