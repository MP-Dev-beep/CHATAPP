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

        conversationId,

        replyMessage,

        setReplyMessage


    } = useConversation();





    const [

        content,

        setContent

    ] = useState("");





    const [

        file,

        setFile

    ] = useState(null);





    const [

        preview,

        setPreview

    ] = useState(null);





    const [

        showEmoji,

        setShowEmoji

    ] = useState(false);





    const [

        uploading,

        setUploading

    ] = useState(false);





    const [

        recording,

        setRecording

    ] = useState(false);





    const mediaRecorderRef =
        useRef(null);



    const chunksRef =
        useRef([]);





    const typingTimeout =
        useRef(null);








    function handleChange(value){



        setContent(value);





        if(conversationId){


            sendTyping(
                conversationId
            );



        }





        if(typingTimeout.current){


            clearTimeout(
                typingTimeout.current
            );


        }





        typingTimeout.current =

            setTimeout(()=>{


                // arrêt côté client

            },2000);



    }









    function handleFileChange(e){



        const selected =
            e.target.files?.[0];





        if(!selected)

            return;






        setFile(selected);





        if(selected.type.startsWith("image")){



            const url =
                URL.createObjectURL(
                    selected
                );



            setPreview(url);



        }
        else{


            setPreview(null);


        }



    }









    function removeFile(){



        if(preview){


            URL.revokeObjectURL(
                preview
            );


        }




        setPreview(null);

        setFile(null);



    }









    function addEmoji(emoji){


        setContent(prev=>

            prev + emoji.emoji

        );


    }









    async function startRecording(){



        try{


            const stream =

                await navigator.mediaDevices.getUserMedia({

                    audio:true

                });






            const recorder =

                new MediaRecorder(
                    stream
                );






            mediaRecorderRef.current =
                recorder;



            chunksRef.current=[];







            recorder.ondataavailable = e=>{


                if(e.data.size > 0){


                    chunksRef.current.push(
                        e.data
                    );


                }


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





                stream
                .getTracks()
                .forEach(track=>

                    track.stop()

                );



            };







            recorder.start();



            setRecording(true);



        }
        catch(error){


            console.error(

                "Erreur microphone",

                error

            );


        }



    }









    function stopRecording(){



        if(mediaRecorderRef.current){



            mediaRecorderRef.current.stop();



            mediaRecorderRef.current=null;



        }



        setRecording(false);



    }









    async function handleSend(){



        if(uploading)

            return;





        if(!conversationId)

            return;






        let fileName=null;

        let fileType=null;

        let fileUrl=null;








        if(file){



            try{



                setUploading(true);





                const response =

                    await uploadFile(
                        file
                    );






                fileName =
                    response.fileName;



                fileType =
                    response.fileType;



                fileUrl =
                    response.fileUrl;





            }
            catch(error){


                console.error(

                    "Erreur upload",

                    error

                );


                return;


            }
            finally{


                setUploading(false);


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

            fileUrl,

            replyMessage

            ?

            replyMessage.id

            :

            null



        );









        setContent("");



        removeFile();



        setShowEmoji(false);



        setReplyMessage(null);



    }









    useEffect(()=>{


        return ()=>{


            if(preview){


                URL.revokeObjectURL(
                    preview
                );


            }



            if(

                typingTimeout.current

            ){


                clearTimeout(
                    typingTimeout.current
                );


            }



            if(mediaRecorderRef.current){



                mediaRecorderRef.current.stop();



            }


        };



    },[preview]);









    return (



        <div className="message-area">






            {
            replyMessage &&

            <div className="reply-preview">


                <div>


                    <strong>

                        Réponse à :

                    </strong>



                    <p>

                        {replyMessage.content}

                    </p>


                </div>





                <button

                    onClick={()=>setReplyMessage(null)}

                >

                    ✕


                </button>



            </div>


            }









            {
            showEmoji &&


            <div className="emoji-panel">


                <EmojiPicker

                    onEmojiClick={addEmoji}

                />


            </div>


            }









            {
            preview &&


            <div className="upload-preview">


                <img

                    src={preview}

                    alt="preview"

                />



                <button

                    onClick={removeFile}

                >

                    ✕

                </button>



            </div>


            }









            {
            file && !preview &&


            <div className="file-preview-bar">


                📎


                <span>

                    {file.name}

                </span>



                <button

                    onClick={removeFile}

                >

                    ✕

                </button>


            </div>


            }









            <div className="message-input">





                <button

                    className="emoji-button"

                    onClick={()=>setShowEmoji(v=>!v)}

                >

                    😊

                </button>







                <label className="attach-button">


                    📎


                    <input

                        type="file"

                        hidden

                        onChange={handleFileChange}

                    />


                </label>







                <input


                    value={content}


                    placeholder="Écrire un message..."


                    onChange={e=>

                        handleChange(
                            e.target.value
                        )

                    }



                    onKeyDown={e=>{


                        if(

                            e.key==="Enter"

                            &&

                            !e.shiftKey

                        ){

                            e.preventDefault();

                            handleSend();

                        }


                    }}


                />









                <button


                    className={

                        recording

                        ?

                        "record-button active"

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

                    "⏹"

                    :

                    "🎤"

                    }


                </button>








                <button


                    className="send-button"



                    onClick={handleSend}



                    disabled={uploading}


                >



                    {

                    uploading

                    ?

                    "..."

                    :

                    "➤"

                    }



                </button>






            </div>





        </div>


    );



}


export default MessageInput;