import api from "./api";



export async function getConversations(){


    const response =
        await api.get(
            "/api/conversations"
        );


    return response.data;


}






export async function createConversation(userId){


    const response =
        await api.post(

            "/api/conversations",

            {
                userId:userId
            }

        );


    return response.data;


}