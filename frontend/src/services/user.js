import axios from "axios";


// =====================================
// INSTANCE AXIOS UNIQUE
// =====================================

const API = axios.create({

    baseURL: "http://localhost:8081/api",

    headers: {
        "Content-Type": "application/json"
    },

    withCredentials: true

});




// =====================================
// AJOUT AUTOMATIQUE JWT
// =====================================

API.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");


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





// =====================================
// GESTION ERREURS API
// =====================================

API.interceptors.response.use(

    (response)=>{

        return response;

    },


    (error)=>{


        if(error.response){


            console.log(
                "ERREUR API :",
                error.response.status,
                error.response.data
            );


            if(
                error.response.status === 401 ||
                error.response.status === 403
            ){

                console.log(
                    "Session expirée"
                );

            }


        }
        else{

            console.log(
                "Erreur réseau :",
                error.message
            );

        }


        return Promise.reject(error);

    }

);





// =====================================
// UTILISATEUR CONNECTE
// =====================================

export const getCurrentUser = async()=>{


    const response = await API.get(
        "/users/me"
    );


    return response.data;

};






// =====================================
// TOUS LES UTILISATEURS
// =====================================

export const getUsers = async()=>{


    const response = await API.get(
        "/users"
    );


    return response.data;

};






// =====================================
// RECHERCHE UTILISATEURS
// =====================================

export const searchUsers = async(keyword)=>{


    const response = await API.get(

        `/users/search?keyword=${keyword}`

    );


    return response.data;

};






// =====================================
// UPDATE PROFIL
// =====================================

export const updateProfile = async(data)=>{


    const response = await API.put(

        "/users/profile",

        data

    );


    return response.data;

};






// =====================================
// UPLOAD AVATAR
// =====================================

export const uploadAvatar = async(file)=>{


    const formData = new FormData();


    formData.append(
        "file",
        file
    );



    const response = await API.post(

        "/users/avatar",

        formData,

        {

            headers:{

                "Content-Type":
                "multipart/form-data"

            }

        }

    );


    return response.data;

};





export default API;