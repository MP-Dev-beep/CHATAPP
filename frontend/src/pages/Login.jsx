import {
    useState
} from "react";


import {
    login
} from "../services/auth";



function Login(){


    const [email,setEmail] =
        useState("");


    const [password,setPassword] =
        useState("");




   async function handleLogin(){

    console.log("Données envoyées :", {
        email,
        password
    });


    try{

        await login({
            email,
            password
        });


        window.location.reload();


    }catch(error){

        console.error(
            "Erreur connexion",
            error
        );

    }

}



    return (

        <div>


            <h2>
                Connexion
            </h2>



            <input

                placeholder="Email"

                value={email}

                onChange={
                    e => setEmail(e.target.value)
                }

            />



            <input

                type="password"

                placeholder="Mot de passe"

                value={password}

                onChange={
                    e => setPassword(e.target.value)
                }

            />



            <button
                onClick={handleLogin}
            >

                Se connecter

            </button>


        </div>

    );


}


export default Login;