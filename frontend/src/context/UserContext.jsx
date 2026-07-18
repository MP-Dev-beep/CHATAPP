import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


import api from "../services/api";


import {
    getCurrentUser
} from "../services/user";




const UserContext =
    createContext(null);






export function UserProvider({
    children
}) {


    const [
        user,
        setUser
    ] = useState(null);



    const [
        users,
        setUsers
    ] = useState([]);







    async function loadUser(){


        try {


            const data =
                await getCurrentUser();



            setUser(data);



            console.log(
                "Utilisateur connecté :",
                data
            );



        } catch(error){


            console.error(
                "Erreur utilisateur :",
                error
            );


        }


    }








    async function fetchUsers(){


        try {


            const response =
                await api.get(
                    "/api/users"
                );



            setUsers(
                response.data || []
            );



        } catch(error){


            console.error(
                "Erreur chargement utilisateurs :",
                error
            );


        }


    }








    useEffect(()=>{


        const token =
            localStorage.getItem("token");



        if(token){


            loadUser();


        }



    },[]);








    return (


        <UserContext.Provider


            value={{


                user,


                setUser,


                users,


                fetchUsers



            }}



        >


            {children}


        </UserContext.Provider>


    );



}










export function useUsers(){


    const context =
        useContext(
            UserContext
        );



    if(!context){


        throw new Error(
            "useUsers doit être utilisé dans UserProvider"
        );


    }



    return context;


}