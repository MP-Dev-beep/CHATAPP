import axios from "axios";


const api = axios.create({

    baseURL: "http://localhost:8081/api",

    headers: {
        "Content-Type": "application/json"
    },

    withCredentials: true

});



// Ajouter automatiquement le JWT
api.interceptors.request.use(

    (config) => {


        const token = localStorage.getItem("token");


        console.log(
            "TOKEN ENVOYE :",
            token
        );


        if(token){

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);



// Gestion expiration token
api.interceptors.response.use(

    (response) => {

        return response;

    },


    (error) => {


        if(error.response?.status === 401 ||
           error.response?.status === 403){


            console.log(
                "Session expirée"
            );


            // optionnel
            // localStorage.removeItem("token");


        }


        return Promise.reject(error);

    }

);



export default api;