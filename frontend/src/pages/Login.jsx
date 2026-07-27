import {
    useState
} from "react";


import {
    login
} from "../services/auth";






function Login(){



    const [email,setEmail]=useState("");

    const [password,setPassword]=useState("");









    async function handleLogin(){



        try{



            await login({

                email,

                password

            });





            window.location.reload();



        }

        catch(error){



            console.error(

                "Erreur connexion",

                error

            );


        }



    }









    return (



        <div className="login-page">





            <div className="login-card">





                <div className="login-logo">

                    💬

                </div>





                <h1>

                    ChatApp

                </h1>



                <p>

                    Connectez-vous à votre espace

                </p>








                <input


                    placeholder="Email"


                    value={email}


                    onChange={

                        e=>

                        setEmail(

                            e.target.value

                        )

                    }


                />








                <input


                    type="password"


                    placeholder="Mot de passe"


                    value={password}


                    onChange={

                        e=>

                        setPassword(

                            e.target.value

                        )

                    }


                />









                <button

                    onClick={handleLogin}

                >

                    Se connecter

                </button>





            </div>






        </div>


    );



}


export default Login;