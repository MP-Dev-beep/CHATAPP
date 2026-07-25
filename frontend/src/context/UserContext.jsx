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


    const [users,setUsers] = useState([]);

    const [user,setUser] = useState(null);

    const [onlineUsers,setOnlineUsers] = useState([]);



    const presenceStarted = useRef(false);








    async function fetchUsers(){


        try{


            const data = await getUsers();



            console.log(
                "USERS RECUS",
                data
            );



            setUsers(
                data || []
            );





            setOnlineUsers(


                (data || [])


                .filter(

                    user=>

                    user.online

                )


                .map(

                    user=>

                    user.email

                )


            );



        }
        catch(error){


            console.error(

                "Erreur chargement users",

                error

            );


        }


    }









    async function loadCurrentUser(){


        try{


            const data =

                await getCurrentUser();





            setUser(data);





            localStorage.setItem(

                "userId",

                data.id

            );



        }
        catch(error){


            console.error(

                "Erreur utilisateur courant",

                error

            );


        }


    }









    async function search(keyword){


        return await searchUsers(keyword);


    }









    async function editProfile(data){


        const updated =

            await updateProfile(data);




        setUser(updated);



        await fetchUsers();



        return updated;



    }









    async function updateAvatar(file){


        const updated =

            await uploadAvatar(file);




        setUser(updated);




        await fetchUsers();




        return updated;



    }















    useEffect(()=>{



        const token =

            localStorage.getItem(
                "token"
            );




        if(!token){

            return;

        }








        async function initialize(){



            await loadCurrentUser();


            await fetchUsers();









            if(!presenceStarted.current){



                presenceStarted.current = true;






                connectPresence(



                    (status)=>{





                        console.log(

                            "PRESENCE EVENT",

                            status

                        );








                        /*
                        =========================
                        UPDATE USERS ONLINE
                        =========================
                        */



                        setUsers(prev=>



                            prev.map(user=>




                                user.email === status.email


                                ?


                                {


                                    ...user,


                                    online:
                                    status.online



                                }



                                :



                                user




                            )



                        );












                        /*
                        =========================
                        LISTE USERS ONLINE
                        =========================
                        */



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






        initialize();









        return ()=>{



            disconnectPresence();



            presenceStarted.current=false;



        };





    },[]);














    return(



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