import api from "./api";



export async function getMessages(conversationId){


    const response =
        await api.get(
            `/api/messages/conversation/${conversationId}`
        );


    return response.data;


}





export async function sendMessage(data){


    const response =
        await api.post(

            "/api/messages",

            data

        );


    return response.data;


}