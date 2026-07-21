import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";


import {
    getUsers,
    getCurrentUser
} from "../services/user";




const UserContext = createContext();





export function UserProvider({children}){


    const [users,setUsers] = useState([]);


    const [user,setUser] = useState(null);








    async function fetchUsers(){


        try{


            const data = await getUsers();


            setUsers(
                data || []
            );


        }
        catch(error){


            console.error(
                "Erreur récupération utilisateurs :",
                error
            );


        }


    }









    async function loadCurrentUser(){


        try{


            const data = await getCurrentUser();


            setUser(
                data
            );


            console.log(
                "Utilisateur connecté :",
                data
            );


        }
        catch(error){


            console.error(
                "Erreur utilisateur connecté :",
                error
            );


        }


    }










    useEffect(()=>{


        loadCurrentUser();

        fetchUsers();


    },[]);









    return (

        <UserContext.Provider


            value={{

                user,

                users,

                fetchUsers,

                loadCurrentUser

            }}


        >


            {children}


        </UserContext.Provider>


    );


}









export function useUsers(){


    const context = useContext(
        UserContext
    );


    if(!context){


        throw new Error(
            "useUsers doit être utilisé dans UserProvider"
        );


    }


    return context;


}