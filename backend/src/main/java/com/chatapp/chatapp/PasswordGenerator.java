package com.chatapp.chatapp;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        System.out.println(
            "ivana = " + encoder.encode("ivana")
        );

        System.out.println(
            "pristile = " + encoder.encode("pristile")
        );

    }
}