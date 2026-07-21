import SockJS from "sockjs-client";
import {
    Client
} from "@stomp/stompjs";



let stompClient = null;


let currentSubscription = null;


let statusSubscription = null;




let pendingDelivered = [];


let pendingRead = [];






export function connectWebSocket(
    conversationId,
    currentUserId,
    onMessageReceived,
    onStatusReceived
){


    const token =
        localStorage.getItem("token");



    if(stompClient){

        disconnectWebSocket();

    }






    stompClient = new Client({


        webSocketFactory:()=>


            new SockJS(
                "http://localhost:8081/ws"
            ),



        connectHeaders:{


            Authorization:
            `Bearer ${token}`


        },



        reconnectDelay:5000,





        onConnect:()=>{


            console.log(
                "STOMP CONNECTED"
            );





            currentSubscription =

            stompClient.subscribe(


                `/topic/conversation/${conversationId}`,


                message=>{


                    const data =
                    JSON.parse(
                        message.body
                    );



                    console.log(
                        "MESSAGE RECU",
                        data
                    );



                    onMessageReceived(
                        data
                    );


                }


            );







            statusSubscription =

            stompClient.subscribe(


                `/topic/message-status/${currentUserId}`,


                message=>{


                    const data =
                    JSON.parse(
                        message.body
                    );



                    console.log(
                        "STATUS RECU",
                        data
                    );



                    onStatusReceived(
                        data
                    );


                }


            );






            /*
              Envoi des statuts bloqués
            */


            pendingDelivered.forEach(id=>{


                sendDeliveredNow(id);


            });



            pendingDelivered=[];





            pendingRead.forEach(id=>{


                sendReadNow(id);


            });



            pendingRead=[];



        }



    });




    stompClient.activate();



}









export function sendMessage(
    conversationId,
    content
){


    if(
        !stompClient ||
        !stompClient.connected
    ){

        console.log(
            "STOMP pas connecté"
        );

        return;

    }




    stompClient.publish({


        destination:
        "/app/chat.send",



        body:
        JSON.stringify({


            conversationId,


            content


        })



    });



}










export function sendDelivered(
    messageId
){



    if(
        !stompClient ||
        !stompClient.connected
    ){


        console.log(
            "Delivered en attente",
            messageId
        );


        pendingDelivered.push(
            messageId
        );


        return;

    }



    sendDeliveredNow(
        messageId
    );



}







function sendDeliveredNow(
    messageId
){



    stompClient.publish({


        destination:
        "/app/message.delivered",



        body:
        JSON.stringify({


            messageId


        })



    });



}









export function sendRead(
    messageId
){



    if(
        !stompClient ||
        !stompClient.connected
    ){



        console.log(
            "Read en attente",
            messageId
        );



        pendingRead.push(
            messageId
        );


        return;

    }



    sendReadNow(
        messageId
    );


}








function sendReadNow(
    messageId
){



    stompClient.publish({


        destination:
        "/app/message.read",



        body:
        JSON.stringify({


            messageId


        })



    });



}









export function disconnectWebSocket(){



    pendingDelivered=[];

    pendingRead=[];




    if(currentSubscription){

        currentSubscription.unsubscribe();

        currentSubscription=null;

    }





    if(statusSubscription){

        statusSubscription.unsubscribe();

        statusSubscription=null;

    }





    if(stompClient){


        stompClient.deactivate();


        stompClient=null;


    }



}