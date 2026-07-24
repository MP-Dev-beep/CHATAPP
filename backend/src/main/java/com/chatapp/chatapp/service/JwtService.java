package com.chatapp.chatapp.service;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;
import java.util.Date;



@Service
public class JwtService {



    /*
    =========================================
        CONFIGURATION JWT
    =========================================
    */


    @Value("${jwt.secret}")
    private String secret;



    @Value("${jwt.expiration}")
    private long expiration;









    /*
    =========================================
        CLE DE SIGNATURE
    =========================================
    */


    private SecretKey getSigningKey(){


        return Keys.hmacShaKeyFor(

                secret.getBytes()

        );


    }









    /*
    =========================================
        CREER TOKEN
        Login
    =========================================
    */


    public String generateToken(String email){



        Date now = new Date();



        Date expiry =

                new Date(

                        now.getTime()
                                +
                        expiration

                );





        return Jwts.builder()

                .subject(email)


                .issuedAt(now)


                .expiration(expiry)


                .signWith(

                        getSigningKey()

                )


                .compact();



    }









    /*
    =========================================
        EXTRAIRE EMAIL DU TOKEN
        Utilisé par :
        - JwtAuthenticationFilter
        - WebSocketAuthInterceptor
    =========================================
    */


    public String extractEmail(String token){



        try{


            Claims claims =


                    Jwts.parser()

                            .verifyWith(

                                    getSigningKey()

                            )

                            .build()

                            .parseSignedClaims(token)

                            .getPayload();





            return claims.getSubject();



        }

        catch(Exception e){


            System.out.println(

                    "JWT EXTRACTION ERROR : "

                    +

                    e.getMessage()

            );



            return null;



        }



    }









    /*
    =========================================
        VALIDATION TOKEN
    =========================================
    */


    public boolean isTokenValid(String token){



        try{


            Claims claims =


                    Jwts.parser()

                            .verifyWith(

                                    getSigningKey()

                            )

                            .build()

                            .parseSignedClaims(token)

                            .getPayload();






            Date expirationDate =


                    claims.getExpiration();





            return expirationDate != null

                    &&

                    expirationDate.after(

                            new Date()

                    );



        }


        catch(Exception e){



            System.out.println(

                    "JWT INVALID : "

                    +

                    e.getMessage()

            );


            return false;



        }



    }



}