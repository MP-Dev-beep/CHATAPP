import {
    useState,
    useEffect
} from "react";

import {
    useUsers
} from "../context/UserContext";

import {
    updateProfile
} from "../services/user";

import {
    uploadFile
} from "../services/api";

function Profile(){

    const {
        user,
        loadCurrentUser
    } = useUsers();

    const [firstname, setFirstname] = useState(
        user?.firstname || ""
    );

    const [lastname, setLastname] = useState(
        user?.lastname || ""
    );

    const [avatar, setAvatar] = useState(
        user?.avatar || ""
    );

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");

    // Mettre à jour les champs locaux si l'objet user change dans le contexte
    useEffect(() => {
        if (user) {
            setFirstname(user.firstname || "");
            setLastname(user.lastname || "");
            setAvatar(user.avatar || "");
        }
    }, [user]);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    async function handleSave(){
        try{
            let uploadedAvatarUrl = avatar;

            // 1. Si un nouveau fichier image a été choisi, on l'upload d'abord
            if (selectedFile) {
                const uploadRes = await uploadFile(selectedFile);
                uploadedAvatarUrl = uploadRes.url; // ex: "/uploads/uuid.png"
            }

            // 2. On envoie ensuite la mise à jour complète du profil
            await updateProfile({
                firstname,
                lastname,
                avatar: uploadedAvatarUrl
            });

            await loadCurrentUser();
            setSelectedFile(null);

            alert(
                "Profil modifié"
            );

        }
        catch(error){
            console.error(error);
            alert("Erreur lors de la mise à jour du profil");
        }
    }

    // Résolution correcte de l'URL de l'avatar pour l'affichage
    const currentAvatarUrl = preview || (avatar ? (avatar.startsWith("http") ? avatar : `http://localhost:8081${avatar}`) : null);

    return (

        <div className="profile-card">

            <div className="profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {
                currentAvatarUrl
                ?
                <img src={currentAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                :
                (
                    user?.firstname
                    ?
                    user.firstname.charAt(0).toUpperCase()
                    :
                    "?"
                )
                }
            </div>

            {/* Input caché ou stylisé pour changer l'avatar */}
            <div style={{ margin: '10px 0' }}>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ fontSize: '12px' }}
                />
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