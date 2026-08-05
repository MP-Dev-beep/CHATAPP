import {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef
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


    const [users,setUsers] =
        useState([]);


    const [user,setUser] =
        useState(null);


    const [onlineUsers,setOnlineUsers] =
        useState([]);



    const presenceStarted =
        useRef(false);








    async function fetchUsers(){


        try{


            const data =
                await getUsers();



            const list =
                Array.isArray(data)
                ?
                data
                :
                [];



            setUsers(list);




            setOnlineUsers(

                list
                .filter(
                    u=>u.online
                )
                .map(
                    u=>u.email
                )

            );



            return list;


        }
        catch(error){


            console.error(
                "Erreur chargement users",
                error
            );


            return [];


        }


    }









    async function loadCurrentUser(){


        try{


            const data =
                await getCurrentUser();



            if(data){


                setUser(data);


                localStorage.setItem(
                    "userId",
                    data.id
                );


            }



            return data;


        }
        catch(error){


            console.error(
                error
            );


            return null;


        }


    }











    async function search(keyword){


        return await searchUsers(keyword);


    }









    async function editProfile(data){


        try{


            await updateProfile(data);



            const updated =
                await loadCurrentUser();




            await fetchUsers();





            window.dispatchEvent(

                new Event(
                    "profileUpdated"
                )

            );



            return updated;


        }
        catch(error){


            console.error(
                "Erreur update profil",
                error
            );


            throw error;


        }


    }











    async function updateAvatar(file){


        try{


            const result =
                await uploadAvatar(file);




            const updated =
                await loadCurrentUser();




            await fetchUsers();






            window.dispatchEvent(

                new Event(
                    "profileUpdated"
                )

            );



            return result || updated;



        }
        catch(error){


            console.error(
                "Erreur avatar",
                error
            );


            throw error;


        }


    }











    useEffect(()=>{


        const token =
            localStorage.getItem(
                "token"
            );



        if(!token){

            return;

        }






        async function start(){



            await loadCurrentUser();


            await fetchUsers();






            if(
                !presenceStarted.current
            ){



                presenceStarted.current=true;






                connectPresence(

                    status=>{


                        if(
                            !status?.email
                        ){

                            return;

                        }







                        setUsers(prev=>

                            prev.map(u=>

                                u.email
                                ===
                                status.email

                                ?

                                {

                                    ...u,

                                    online:
                                    status.online

                                }

                                :

                                u

                            )

                        );






                        setOnlineUsers(prev=>{


                            if(status.online){



                                if(
                                    prev.includes(
                                        status.email
                                    )
                                ){

                                    return prev;

                                }



                                return [

                                    ...prev,

                                    status.email

                                ];


                            }



                            return prev.filter(

                                email=>

                                email !== status.email

                            );


                        });



                    }

                );


            }



        }






        start();







        return ()=>{


            disconnectPresence();


            presenceStarted.current=false;


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

                loadCurrentUser,

                editProfile,

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