import {
    useUsers
} from "../context/UserContext";



function Profile(){



    const {

        user,

        updateAvatar


    } = useUsers();





    async function handleImage(e){


        const file =

            e.target.files[0];



       if(file){


    const result =

        await updateAvatar(
            file
        );


    console.log(
        "RESULTAT UPLOAD :",
        result
    );


}

    }







    return (


        <div className="profile">





            <div className="avatar large">



                {

                    user?.avatar ?



                    <img

                        src={
                            `http://localhost:8081${user.avatar}`
                        }

                        alt="avatar"

                    />



                    :



                    <span>

                    {
                        user?.firstname
                        ?.charAt(0)
                    }

                    </span>



                }



            </div>







            <h3>


                {user?.firstname}

                {" "}

                {user?.lastname}


            </h3>







            <input


                type="file"


                accept="image/*"


                onChange={
                    handleImage
                }


            />






        </div>


    );


}


export default Profile;