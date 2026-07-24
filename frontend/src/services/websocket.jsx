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
CONNEXION CHAT WEBSOCKET
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
                "STOMP",
                msg
            );


        },









        onConnect:()=>{



            console.log(

                "CHAT WEBSOCKET CONNECTE"

            );




            connected=true;







            /*
            =================================
            MESSAGES
            =================================
            */


            const messageSub =


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



                    onMessageReceived(

                        data

                    );


                }


            );









            /*
            =================================
            STATUS MESSAGE ✓✓
            =================================
            */


            const statusSub =


            stompClient.subscribe(



                `/topic/message-status/${currentUserId}`,



                frame=>{


                    const data = JSON.parse(

                        frame.body

                    );



                    console.log(

                        "MESSAGE STATUS",

                        data

                    );



                    onStatusReceived(

                        data

                    );



                }


            );









            /*
            =================================
            TYPING
            =================================
            */


            const typingSub =


            stompClient.subscribe(



                `/topic/typing/${conversationId}`,



                frame=>{


                    onTypingReceived(

                        frame.body

                    );


                }


            );









            subscriptions.push(

                messageSub,

                statusSub,

                typingSub

            );









            /*
            =================================
            ENVOIS EN ATTENTE
            =================================
            */


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


        },









        onStompError:(error)=>{


            console.error(

                "STOMP ERROR",

                error

            );


        }



    });






    stompClient.activate();



}














/*
================================================
PRESENCE ONLINE / OFFLINE
================================================
*/


export function connectPresence(onStatus){



    const token =

        localStorage.getItem("token");







    if(presenceClient){


        disconnectPresence();


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







            presenceSubscription =


            presenceClient.subscribe(



                "/topic/users-status",



                frame=>{



                    const data = JSON.parse(

                        frame.body

                    );







                    console.log(

                        "STATUS USER",

                        data

                    );







                    onStatus(data);




                }



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















/*
================================================
ENVOYER MESSAGE
================================================
*/


export function sendMessage(

    conversationId,

    content

){



    if(!connected){



        console.log(

            "WEBSOCKET NON CONNECTE"

        );


        return;


    }







    stompClient.publish({



        destination:

        "/app/chat.send",






        body:JSON.stringify({



            conversationId,


            content



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






    sendDeliveredNow(

        messageId

    );



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






    sendReadNow(

        messageId

    );



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
DECONNEXION CHAT
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