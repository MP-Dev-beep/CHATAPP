import api from "./api";



export async function login(data){


    const response =

        await api.post(

            "/auth/login",

            data

        );



    localStorage.setItem(

        "token",

        response.data.token

    );



    localStorage.setItem(

        "userId",

        response.data.user.id

    );



    return response.data;


}