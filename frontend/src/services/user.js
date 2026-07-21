import api from "./api";




// =====================================
// RECUPERER TOUS LES UTILISATEURS
// =====================================

export async function getUsers(){


    const response = await api.get(
        "/users"
    );


    return response.data;

}






// =====================================
// UTILISATEUR CONNECTE
// =====================================

export async function getCurrentUser(){


    const response = await api.get(
        "/users/me"
    );


    return response.data;


}