package com.chatapp.chatapp.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class UserStatusResponse {


    private String email;


    private boolean online;


}