import {
    useEffect,
    useState
} from "react";


import {
    useUsers
} from "../context/UserContext";


import {
    useConversation
} from "../context/ConversationContext";



function Profile(){


    const {
        user,
        editProfile,
        updateAvatar
    } = useUsers();



    const {
        refreshConversationUsers
    } = useConversation();




    const [firstname,setFirstname] =
        useState("");

    const [lastname,setLastname] =
        useState("");

    const [selectedFile,setSelectedFile] =
        useState(null);

    const [preview,setPreview] =
        useState("");

    const [avatarUrl,setAvatarUrl] =
        useState("");









    useEffect(()=>{


        if(user){


            setFirstname(
                user.firstname || ""
            );


            setLastname(
                user.lastname || ""
            );



            setAvatarUrl(
                user.avatar || ""
            );


        }


    },[user]);











    useEffect(()=>{


        return ()=>{


            if(preview){


                URL.revokeObjectURL(
                    preview
                );


            }


        };


    },[preview]);











    function handleFileChange(e){


        const file =
            e.target.files[0];



        if(file){


            setSelectedFile(file);



            setPreview(
                URL.createObjectURL(file)
            );


        }


    }











    async function handleSave(){


        try{



            let newAvatar =
                avatarUrl;






            if(selectedFile){



                const uploaded =
                    await updateAvatar(
                        selectedFile
                    );



                if(uploaded?.url){


                    newAvatar =
                        uploaded.url;


                }
                else if(uploaded?.avatar){


                    newAvatar =
                        uploaded.avatar;


                }



            }






            await editProfile({


                firstname,


                lastname,


                avatar:newAvatar



            });







            await refreshConversationUsers();







            setAvatarUrl(
                newAvatar
            );



            setSelectedFile(null);



            setPreview("");






            alert(
                "Profil modifié avec succès"
            );



        }
        catch(error){


            console.error(
                error
            );


            alert(
                "Erreur modification profil"
            );


        }


    }









    function getAvatar(value){


        if(!value){

            return null;

        }



        const url =
            value.startsWith("http")

            ?

            value

            :

            `http://localhost:8081${value}`;



        return (
            url
            +
            "?t="
            +
            Date.now()
        );


    }








    const image =
        preview
        ||
        getAvatar(avatarUrl);









    return (


        <div className="profile-card">





            <div
                className="profile-avatar"
                style={{
                    overflow:"hidden",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center"
                }}
            >


                {

                    image

                    ?

                    <img

                        src={image}

                        alt="avatar"

                        style={{

                            width:"100%",

                            height:"100%",

                            objectFit:"cover"

                        }}

                    />

                    :

                    firstname

                    ?

                    firstname
                    .charAt(0)
                    .toUpperCase()

                    :

                    "?"

                }


            </div>








            <input

                type="file"

                accept="image/*"

                onChange={handleFileChange}

            />








            <h2>
                Mon profil
            </h2>








            <input

                value={firstname}

                placeholder="Prénom"

                onChange={
                    e=>
                    setFirstname(
                        e.target.value
                    )
                }

            />








            <input

                value={lastname}

                placeholder="Nom"

                onChange={
                    e=>
                    setLastname(
                        e.target.value
                    )
                }

            />








            <button

                onClick={handleSave}

            >

                Enregistrer

            </button>





        </div>


    );


}


export default Profile;