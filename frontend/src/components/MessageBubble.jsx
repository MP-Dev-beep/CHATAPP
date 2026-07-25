import {

    useUsers

} from "../context/UserContext";




function MessageBubble({

    message

}){


    const {

        user

    } = useUsers();





    const isMine =

        Number(message.senderId)

        ===

        Number(user?.id);







    function formatTime(date){


        if(!date)

            return "";


        return new Date(date)

        .toLocaleTimeString(

            [],

            {

                hour:"2-digit",

                minute:"2-digit"

            }

        );


    }








    function renderStatus(){


        if(!isMine)

            return null;





        if(!message.delivered){


            return (

                <span className="status">

                    ✓

                </span>

            );


        }






        if(

            message.delivered

            &&

            !message.read

        ){


            return (

                <span className="status">

                    ✓✓

                </span>

            );


        }






        if(message.read){


            return (

                <span className="status read">

                    ✓✓

                </span>

            );


        }



    }









    const fileUrl =

        message.fileUrl

        ?

        "http://localhost:8081"

        +

        message.fileUrl

        :

        null;









    return(


<div

className={

isMine

?

"message my-message"

:

"message other-message"

}


>



<div className="bubble">







{
message.content &&


<p>

{message.content}

</p>


}












{
message.fileType==="IMAGE"

&&


<img

src={fileUrl}

alt={message.fileName}

className="message-image"

/>

}









{
message.fileType==="VIDEO"

&&


<video

controls

className="message-video"

>


<source

src={fileUrl}

/>


</video>


}









{
message.fileType==="AUDIO"

&&


<audio

controls

>


<source

src={fileUrl}

/>


</audio>


}









{
message.fileType==="DOCUMENT"

&&


<a

href={fileUrl}

target="_blank"

rel="noreferrer"

>

📄 {message.fileName}


</a>


}









<div className="message-info">


<span>

{formatTime(message.sentAt)}

</span>



{
renderStatus()

}


</div>






</div>





</div>


);



}



export default MessageBubble;