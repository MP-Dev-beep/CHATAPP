import {
    useState
} from "react";

import {
    useTheme
} from "../context/ThemeContext";

import Profile from "../pages/Profile";


function SettingsMenu({
    onClose
}){


    const {
        dark,
        toggleTheme
    } = useTheme();



    const [
        notifications,
        setNotifications
    ] = useState(true);



    const [
        showProfile,
        setShowProfile
    ] = useState(false);



    function logout(){


        const confirmLogout =
            window.confirm(
                "Voulez-vous vraiment vous déconnecter ?"
            );


        if(!confirmLogout)
            return;



        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "userId"
        );


        window.location.reload();


    }





    return (


        <div className="settings-overlay">


            <div className="settings-menu">



                <div className="settings-header">


                    <h3>
                        ⚙ Paramètres
                    </h3>


                    <button
                        className="close-settings"
                        onClick={onClose}
                    >
                        ✕
                    </button>


                </div>





                <div className="settings-section">


                    <h4>
                        🎨 Apparence
                    </h4>



                    <button

                        className="settings-item"

                        onClick={toggleTheme}

                    >

                        {
                        dark

                        ?

                        "☀️ Passer en mode clair"

                        :

                        "🌙 Passer en mode sombre"

                        }


                    </button>


                </div>








                <div className="settings-section">


                    <h4>
                        🔔 Notifications
                    </h4>



                    <button

                        className="settings-item"

                        onClick={()=>
                        setNotifications(
                            !notifications
                        )}

                    >

                        {
                        notifications

                        ?

                        "🔔 Notifications activées"

                        :

                        "🔕 Notifications désactivées"

                        }


                    </button>


                </div>








                <div className="settings-section">


                    <h4>
                        👤 Compte
                    </h4>



                    <button

                        className="settings-item"

                        onClick={()=>
                        setShowProfile(true)}

                    >

                        ✏️ Modifier mon profil

                    </button>





                    <button

                        className="settings-item"

                    >

                        🖼 Changer ma photo

                    </button>



                </div>








                <div className="settings-section">


                    <h4>
                        🔒 Confidentialité
                    </h4>



                    <button

                        className="settings-item"

                    >

                        👁 Dernière connexion

                    </button>




                    <button

                        className="settings-item"

                    >

                        🚫 Utilisateurs bloqués

                    </button>



                </div>









                <div className="settings-section">


                    <h4>
                        💬 Discussions
                    </h4>



                    <button

                        className="settings-item"

                    >

                        📁 Discussions archivées

                    </button>





                    <button

                        className="settings-item"

                    >

                        🗑 Vider les discussions

                    </button>



                </div>










                <div className="settings-footer">


                    <button

                        className="logout-button"

                        onClick={logout}

                    >

                        🚪 Déconnexion

                    </button>



                </div>








            </div>







            {
            showProfile

            &&


            <div className="profile-popup">


                <button

                    className="close-profile"

                    onClick={()=>
                    setShowProfile(false)}

                >

                    ✕

                </button>



                <Profile />


            </div>


            }




        </div>


    );


}



export default SettingsMenu;