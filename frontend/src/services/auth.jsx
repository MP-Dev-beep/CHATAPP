import api from "./api";



// LOGIN
export const login = async (data) => {


    try {


        const response = await api.post(
            "/auth/login",
            data
        );


        console.log(
            "REPONSE LOGIN :",
            response.data
        );



        const token =
            response.data.token;



        if(token){


            localStorage.setItem(
                "token",
                token
            );


            console.log(
                "TOKEN STOCKE :",
                token
            );


        }



        if(response.data.user){


            localStorage.setItem(

                "user",

                JSON.stringify(
                    response.data.user
                )

            );


        }



        return response.data;



    } catch(error){


        console.error(
            "Erreur connexion :",
            error
        );


        throw error;

    }

};




// REGISTER
export const register = async (data) => {


    try {


        const response = await api.post(

            "/auth/register",

            data

        );



        console.log(
            "REPONSE REGISTER :",
            response.data
        );



        const token =
            response.data.token;



        if(token){


            localStorage.setItem(
                "token",
                token
            );


        }



        if(response.data.user){


            localStorage.setItem(

                "user",

                JSON.stringify(
                    response.data.user
                )

            );


        }



        return response.data;



    } catch(error){


        console.error(
            "Erreur inscription :",
            error
        );


        throw error;


    }


};




// LOGOUT
export const logout = () => {


    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "user"
    );


};