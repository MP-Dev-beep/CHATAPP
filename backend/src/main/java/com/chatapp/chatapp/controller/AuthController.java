package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.AuthResponse;
import com.chatapp.chatapp.dto.LoginRequest;
import com.chatapp.chatapp.dto.RegisterRequest;
import com.chatapp.chatapp.service.UserService;


import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class AuthController {



    private final UserService userService;





    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request
    ){


        return ResponseEntity.ok(

                userService.register(request)

        );


    }






    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(

            @RequestBody LoginRequest request

    ){


        System.out.println(
                "========== LOGIN =========="
        );


        System.out.println(
                "EMAIL : "
                + request.getEmail()
        );


        try {


            AuthResponse response =

                    userService.login(request);



            System.out.println(
                    "LOGIN OK TOKEN : "
                    + response.getToken()
            );



            return ResponseEntity.ok(response);



        } catch(Exception e){


            System.out.println(
                    "LOGIN ERROR : "
                    + e.getMessage()
            );


            throw e;


        }


    }



}