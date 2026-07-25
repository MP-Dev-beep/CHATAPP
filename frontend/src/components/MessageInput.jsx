import {
    useState,
    useEffect,
    useRef
} from "react";

import {
    useConversation
} from "../context/ConversationContext";

import {
    sendMessage,
    sendTyping
} from "../services/websocket";

import {
    uploadFile
} from "../services/api";

import EmojiPicker from "emoji-picker-react";

function MessageInput(){

    const {
        conversationId
    } = useConversation();

    const [content,setContent] = useState("");

    const [file,setFile] = useState(null);

    const [preview,setPreview] = useState(null);

    const [showEmoji,setShowEmoji] = useState(false);

    const [uploading,setUploading] = useState(false);

    /*
    ===========================
    MESSAGE VOCAL
    ===========================
    */

    const mediaRecorderRef = useRef(null);

    const chunksRef = useRef([]);

    const [recording,setRecording] = useState(false);

    /*
    ===========================
    TYPING
    ===========================
    */

    function handleChange(value){

        setContent(value);

        if(conversationId){

            sendTyping(conversationId);

        }

    }

    /*
    ===========================
    SELECTION FICHIER
    ===========================
    */

    function handleFileChange(e){

        const selected = e.target.files[0];

        if(!selected){

            return;

        }

        setFile(selected);

        if(selected.type.startsWith("image")){

            const url = URL.createObjectURL(selected);

            setPreview(url);

        }
        else{

            setPreview(null);

        }

    }

    /*
    ===========================
    SUPPRIMER FICHIER
    ===========================
    */

    function removeFile(){

        if(preview){

            URL.revokeObjectURL(preview);

        }

        setPreview(null);

        setFile(null);

    }

    /*
    ===========================
    EMOJI
    ===========================
    */

    function addEmoji(emoji){

        setContent(

            previous => previous + emoji.emoji

        );

    }

    /*
    ===========================
    ENREGISTREMENT VOCAL
    ===========================
    */

    async function startRecording(){

        try{

            const stream =

                await navigator.mediaDevices.getUserMedia({

                    audio:true

                });

            const recorder =

                new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            chunksRef.current = [];

            recorder.ondataavailable = event=>{

                chunksRef.current.push(event.data);

            };

            recorder.onstop = ()=>{

                const blob =

                    new Blob(

                        chunksRef.current,

                        {

                            type:"audio/webm"

                        }

                    );

                const audioFile =

                    new File(

                        [blob],

                        "audio.webm",

                        {

                            type:"audio/webm"

                        }

                    );

                setFile(audioFile);

                setPreview(null);

                stream.getTracks().forEach(track=>track.stop());

            };

            recorder.start();

            setRecording(true);

        }

        catch(error){

            console.error(

                "Erreur micro",

                error

            );

        }

    }

    function stopRecording(){

        if(mediaRecorderRef.current){

            mediaRecorderRef.current.stop();

            setRecording(false);

        }

    }

    /*
    ===========================
    ENVOYER
    ===========================
    */

    async function handleSend(){

        if(!conversationId){

            return;

        }

        let fileName = null;

        let fileType = null;

        let fileUrl = null;

        if(file){

            try{

                setUploading(true);

                const response =

                    await uploadFile(file);

                fileName = response.fileName;

                fileType = response.fileType;

                fileUrl = response.fileUrl;

                setUploading(false);

            }

            catch(error){

                console.error(

                    "UPLOAD ERROR",

                    error

                );

                setUploading(false);

                return;

            }

        }

        if(

            !content.trim()

            &&

            !fileUrl

        ){

            return;

        }

        sendMessage(

            conversationId,

            content.trim(),

            fileName,

            fileType,

            fileUrl

        );

        setContent("");

        removeFile();

        setShowEmoji(false);

    }

    useEffect(()=>{

        return ()=>{

            if(preview){

                URL.revokeObjectURL(preview);

            }

        };

    },[preview]);

        return(

        <div className="message-input">

            {
                showEmoji &&

                <div className="emoji-box">

                    <EmojiPicker
                        onEmojiClick={addEmoji}
                    />

                </div>
            }

            {
                preview &&

                <div className="file-preview">

                    <img
                        src={preview}
                        className="preview-image"
                        alt="preview"
                    />

                    <button
                        type="button"
                        className="remove-file"
                        onClick={removeFile}
                    >
                        ❌
                    </button>

                </div>
            }

            {
                file &&
                !preview &&

                <div className="document-preview">

                    {
                        file.type.startsWith("audio")
                        ?
                        "🎤"
                        :
                        "📄"
                    }

                    <span>

                        {file.name}

                    </span>

                    <button
                        type="button"
                        onClick={removeFile}
                    >
                        ❌
                    </button>

                </div>
            }

            <button
                type="button"
                className="emoji-button"
                onClick={()=>
                    setShowEmoji(!showEmoji)
                }
            >
                😊
            </button>

            <input
                type="file"
                className="file-input"
                onChange={handleFileChange}
            />

            <button
                type="button"
                className={
                    recording
                    ?
                    "record-button recording"
                    :
                    "record-button"
                }
                onClick={
                    recording
                    ?
                    stopRecording
                    :
                    startRecording
                }
            >
                {
                    recording
                    ?
                    "⏹️"
                    :
                    "🎤"
                }
            </button>

            <input

                value={content}

                placeholder="Écrire un message..."

                onChange={

                    e=>

                    handleChange(
                        e.target.value
                    )

                }

                onKeyDown={

                    e=>{

                        if(e.key==="Enter"){

                            handleSend();

                        }

                    }

                }

            />

            <button

                type="button"

                className="send-button"

                onClick={handleSend}

                disabled={uploading}

            >

                {

                    uploading

                    ?

                    "Téléchargement..."

                    :

                    "Envoyer"

                }

            </button>

        </div>

    );

}

export default MessageInput;