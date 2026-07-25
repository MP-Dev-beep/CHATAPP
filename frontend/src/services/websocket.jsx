import SockJS from "sockjs-client";

import {
    Client
} from "@stomp/stompjs";





let stompClient = null;

let presenceClient = null;

let presenceSubscription = null;

let subscriptions = [];

let connected = false;

let pendingDelivered = [];

let pendingRead = [];







/*
================================================
CHAT WEBSOCKET
================================================
*/


export function connectWebSocket(

    conversationId,

    currentUserId,

    onMessageReceived,

    onStatusReceived,

    onTypingReceived

){


    const token =
        localStorage.getItem("token");




    if(!token){

        console.log(
            "PAS TOKEN CHAT"
        );

        return;

    }








    if(stompClient){

        disconnectWebSocket();

    }









    stompClient = new Client({




        webSocketFactory:()=>{


            return new SockJS(

                "http://localhost:8081/ws"

            );


        },






        connectHeaders:{


            Authorization:

            `Bearer ${token}`


        },






        reconnectDelay:5000,







        debug:(msg)=>{


            console.log(

                "CHAT",

                msg

            );


        },









        onConnect:()=>{



            console.log(
                "CHAT WEBSOCKET CONNECTE"
            );




            connected=true;









            const messageSubscription =


            stompClient.subscribe(



                `/topic/conversation/${conversationId}`,



                frame=>{



                    const data = JSON.parse(

                        frame.body

                    );





                    console.log(

                        "MESSAGE RECU",

                        data

                    );






                    onMessageReceived(data);



                }



            );









            const statusSubscription =


            stompClient.subscribe(



                `/topic/message-status/${currentUserId}`,



                frame=>{



                    const data = JSON.parse(

                        frame.body

                    );





                    onStatusReceived(data);



                }



            );









            const typingSubscription =


            stompClient.subscribe(



                `/topic/typing/${conversationId}`,



                frame=>{



                    onTypingReceived(

                        frame.body

                    );


                }



            );









            subscriptions.push(

                messageSubscription,

                statusSubscription,

                typingSubscription

            );









            pendingDelivered.forEach(id=>{


                sendDeliveredNow(id);


            });



            pendingDelivered=[];









            pendingRead.forEach(id=>{


                sendReadNow(id);


            });



            pendingRead=[];



        },









        onDisconnect:()=>{


            connected=false;


            console.log(

                "CHAT DECONNECTE"

            );


        }







    });








    stompClient.activate();



}









/*
================================================
PRESENCE WEBSOCKET
================================================
*/


export function connectPresence(onStatus){



    const token =

        localStorage.getItem("token");







    if(!token){


        console.log(
            "PAS TOKEN PRESENCE"
        );


        return;


    }








    if(presenceClient){


        console.log(

            "PRESENCE DEJA CONNECTEE"

        );


        return;


    }









    presenceClient = new Client({







        webSocketFactory:()=>{


            return new SockJS(

                "http://localhost:8081/ws"

            );


        },








        connectHeaders:{



            Authorization:

            `Bearer ${token}`


        },








        reconnectDelay:5000,








        debug:(msg)=>{


            console.log(

                "PRESENCE",

                msg

            );


        },









        onConnect:()=>{



            console.log(

                "PRESENCE CONNECTEE"

            );






            if(presenceSubscription){


                presenceSubscription.unsubscribe();


            }







            presenceSubscription =


            presenceClient.subscribe(



                "/topic/users-status",




                frame=>{



                    try{



                        const data = JSON.parse(

                            frame.body

                        );





                        console.log(

                            "PRESENCE RECUE",

                            data

                        );






                        onStatus(data);



                    }

                    catch(error){


                        console.error(

                            "ERREUR PRESENCE",

                            error

                        );


                    }




                }



            );




        },






        onDisconnect:()=>{


            console.log(

                "PRESENCE DECONNECTEE"

            );


        }






    });







    presenceClient.activate();



}














export function disconnectPresence(){



    if(presenceSubscription){


        presenceSubscription.unsubscribe();


        presenceSubscription=null;


    }







    if(presenceClient){



        presenceClient.deactivate();



        presenceClient=null;



    }



}









export function isPresenceConnected(){



    return (

        presenceClient !== null

        &&

        presenceClient.connected

    );


}









/*
================================================
ENVOYER MESSAGE
TEXTE + FICHIER
================================================
*/


export function sendMessage(

    conversationId,

    content,

    fileName=null,

    fileType=null,

    fileUrl=null

){



    if(!connected){



        console.log(

            "CHAT WS NON CONNECTE"

        );



        return;



    }










    stompClient.publish({




        destination:

        "/app/chat.send",







        body:JSON.stringify({



            conversationId,


            content,



            fileName,


            fileType,


            fileUrl



        })





    });



}









/*
================================================
MESSAGE LIVRE ✓✓ GRIS
================================================
*/


export function sendDelivered(messageId){



    if(!connected){



        pendingDelivered.push(

            messageId

        );



        return;


    }






    sendDeliveredNow(messageId);



}








function sendDeliveredNow(messageId){



    stompClient.publish({



        destination:

        "/app/message.delivered",






        body:JSON.stringify({


            messageId


        })



    });



}









/*
================================================
MESSAGE LU ✓✓ BLEU
================================================
*/


export function sendRead(messageId){



    if(!connected){



        pendingRead.push(

            messageId

        );



        return;


    }






    sendReadNow(messageId);



}








function sendReadNow(messageId){



    stompClient.publish({



        destination:

        "/app/message.read",






        body:JSON.stringify({


            messageId


        })



    });



}









/*
================================================
TYPING
================================================
*/


export function sendTyping(conversationId){



    if(!connected){


        return;


    }







    stompClient.publish({



        destination:

        "/app/chat.typing",






        body:JSON.stringify({



            conversationId



        })



    });



}









/*
================================================
DECONNECT CHAT
================================================
*/


export function disconnectWebSocket(){



    subscriptions.forEach(sub=>{


        sub.unsubscribe();


    });





    subscriptions=[];



    pendingDelivered=[];


    pendingRead=[];





    connected=false;








    if(stompClient){



        stompClient.deactivate();



        stompClient=null;



    }



}