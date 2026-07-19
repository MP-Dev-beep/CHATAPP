package com.chatapp.chatapp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        String password = "Jean1234";

        String hash = encoder.encode(password);

        System.out.println("Mot de passe : " + password);
        System.out.println("Hash BCrypt : " + hash);
    }
}