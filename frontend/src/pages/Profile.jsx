import {
    useState
} from "react";


import {
    useUsers
} from "../context/UserContext";


import {
    updateProfile
} from "../services/user";





function Profile(){


    const {
        user,
        loadCurrentUser
    } = useUsers();





    const [firstname,setFirstname] = useState(
        user?.firstname || ""
    );


    const [lastname,setLastname] = useState(
        user?.lastname || ""
    );





    async function handleSave(){


        try{


            await updateProfile({

                firstname,

                lastname

            });



            await loadCurrentUser();



            alert(
                "Profil modifié"
            );


        }
        catch(error){


            console.error(error);


        }


    }





    return (

        <div className="profile-card">


            <div className="profile-avatar">


                {

                user?.firstname

                ?

                user.firstname.charAt(0).toUpperCase()

                :

                "?"

                }


            </div>





            <h2>

                Mon profil

            </h2>





            <div className="profile-name">


                {user?.firstname}

                {" "}

                {user?.lastname}


            </div>







            <input

                value={firstname}

                onChange={
                    e=>setFirstname(e.target.value)
                }

                placeholder="Prénom"

            />







            <input

                value={lastname}

                onChange={
                    e=>setLastname(e.target.value)
                }

                placeholder="Nom"

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