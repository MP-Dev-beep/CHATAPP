import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";


let stompClient = null;

let currentSubscription = null;




export function connectWebSocket(
    conversationId,
    onMessageReceived
){



    if(stompClient && stompClient.connected){


        if(currentSubscription){

            currentSubscription.unsubscribe();

        }


        currentSubscription =
            stompClient.subscribe(

                `/topic/conversation/${conversationId}`,

                message=>{


                    const data =
                        JSON.parse(
                            message.body
                        );


                    console.log(
                        "Message reçu :",
                        data
                    );


                    onMessageReceived(data);


                }

            );


        return;

    }






    stompClient =
        new Client({



            webSocketFactory:()=>


                new SockJS(
                    "http://localhost:8081/ws"
                ),




            connectHeaders:{


                Authorization:
                `Bearer ${localStorage.getItem("token")}`


            },




            reconnectDelay:5000,





            debug:(message)=>{


                console.log(
                    message
                );


            },






            onConnect:()=>{



                console.log(
                    "STOMP connecté"
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
                            "Message reçu :",
                            data
                        );



                        onMessageReceived(
                            data
                        );

                    }


                );



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
            "STOMP non connecté"
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



    console.log(
        "Message envoyé"
    );


}








export function disconnectWebSocket(){


    if(currentSubscription){

        currentSubscription.unsubscribe();

        currentSubscription=null;

    }



    if(stompClient){

        stompClient.deactivate();

        stompClient=null;

    }


}