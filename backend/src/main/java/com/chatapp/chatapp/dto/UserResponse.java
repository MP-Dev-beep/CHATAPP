package com.chatapp.chatapp.dto;


import lombok.Builder;
import lombok.Getter;



@Getter
@Builder
public class UserResponse {


    private Long id;


    private String firstname;


    private String lastname;


    private String email;


    private String avatar;


    private boolean online;



}