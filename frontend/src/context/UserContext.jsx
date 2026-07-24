import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";


import {
    getUsers,
    getCurrentUser,
    searchUsers,
    updateProfile,
    uploadAvatar
} from "../services/user";


import {
    connectPresence,
    disconnectPresence
} from "../services/websocket";




const UserContext = createContext();






export function UserProvider({children}){


    const [
        users,
        setUsers
    ] = useState([]);





    const [
        user,
        setUser
    ] = useState(null);






    const [
        onlineUsers,
        setOnlineUsers
    ] = useState([]);










    async function fetchUsers(){


        try{


            const data = await getUsers();



            setUsers(data || []);





            const online =

            (data || [])

            .filter(

                u=>u.online

            )

            .map(

                u=>u.email

            );




            setOnlineUsers(
                online
            );



        }

        catch(error){


            console.error(
                "Erreur users",
                error
            );


        }


    }











    async function loadCurrentUser(){



        try{


            const data = await getCurrentUser();



            setUser(data);




            localStorage.setItem(

                "userId",

                data.id

            );


        }

        catch(error){


            console.error(
                "Erreur user",
                error
            );


        }



    }









    async function search(keyword){


        try{


            return await searchUsers(
                keyword
            );


        }

        catch(error){


            console.error(
                error
            );


            return [];

        }


    }









    async function editProfile(data){


        try{


            const updated =

            await updateProfile(data);



            setUser(updated);



            await fetchUsers();



            return updated;


        }

        catch(error){


            console.error(
                error
            );


        }


    }











    async function updateAvatar(file){



        try{


            const updated =

            await uploadAvatar(file);




            setUser(updated);



            await fetchUsers();



            return updated;


        }

        catch(error){


            console.error(error);


            throw error;


        }


    }












    useEffect(()=>{



        if(
            !localStorage.getItem("token")
        ){

            return;

        }






        loadCurrentUser();

        fetchUsers();








        /*
        ===============================
        CONNEXION PRESENCE WEBSOCKET
        ===============================
        */



        connectPresence(

            (status)=>{



                console.log(
                    "PRESENCE EVENT",
                    status
                );





                setUsers(prev=>


                    prev.map(u=>


                        u.email === status.email

                        ?

                        {

                            ...u,

                            online:status.online

                        }


                        :

                        u


                    )


                );







                setOnlineUsers(prev=>{



                    if(status.online){



                        if(
                            !prev.includes(
                                status.email
                            )
                        ){

                            return [

                                ...prev,

                                status.email

                            ];

                        }


                        return prev;



                    }

                    else{


                        return prev.filter(

                            email =>

                            email !== status.email

                        );


                    }



                });



            }



        );












        return ()=>{


            disconnectPresence();


        };




    },[]);












    return (



        <UserContext.Provider


            value={{


                user,


                users,


                onlineUsers,


                fetchUsers,


                search,


                editProfile,


                loadCurrentUser,


                updateAvatar



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