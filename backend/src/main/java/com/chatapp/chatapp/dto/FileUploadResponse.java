package com.chatapp.chatapp.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class FileUploadResponse {


    private String fileName;


    private String fileType;


    private String fileUrl;


}