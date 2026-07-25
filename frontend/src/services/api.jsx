import axios from "axios";



const api = axios.create({

    baseURL:"http://localhost:8081/api",

    withCredentials:true

});







/*
========================================
JWT AUTOMATIQUE
========================================
*/


api.interceptors.request.use(

    (config)=>{


        const token = localStorage.getItem(
            "token"
        );


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


    (error)=>{


        return Promise.reject(error);


    }


);









/*
========================================
ERREURS AUTH
========================================
*/


api.interceptors.response.use(


    response=>response,


    error=>{


        if(
            error.response?.status===401
            ||
            error.response?.status===403
        ){


            console.log(
                "SESSION EXPIREE"
            );


        }



        return Promise.reject(error);


    }



);









/*
========================================
UPLOAD FICHIER
IMAGE VIDEO AUDIO DOCUMENT
========================================
*/


export async function uploadFile(file){



    const formData = new FormData();



    formData.append(

        "file",

        file

    );






    const response = await api.post(



        "/files/upload",



        formData,



        {

            headers:{

                "Content-Type":
                "multipart/form-data"

            }


        }



    );







    return response.data;


}









export default api;