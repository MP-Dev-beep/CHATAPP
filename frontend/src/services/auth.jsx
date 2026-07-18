import api from "./api";


export async function login(data){


    const response = await api.post(
        "/api/auth/login",
        data
    );


    localStorage.setItem(
        "token",
        response.data.token
    );


    return response.data;

}