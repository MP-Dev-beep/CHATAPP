package com.chatapp.chatapp.security;


import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;


import java.util.List;



@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {



    @Override
    public Message<?> preSend(
            Message<?> message,
            MessageChannel channel
    ){



        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);



        if(StompCommand.CONNECT.equals(accessor.getCommand())){



            List<String> headers =
                    accessor.getNativeHeader(
                        "Authorization"
                    );



            if(headers != null && !headers.isEmpty()){



                String token =
                        headers.get(0)
                        .replace(
                            "Bearer ",
                            ""
                        );



                String email =
                        "user";


                accessor.setUser(

                    new UsernamePasswordAuthenticationToken(

                        email,

                        null,

                        List.of()

                    )

                );

            }


        }



        return message;


    }


}