package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.FileUploadResponse;


import lombok.RequiredArgsConstructor;


import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;



import java.io.IOException;

import java.nio.file.Files;

import java.nio.file.Path;

import java.nio.file.Paths;

import java.nio.file.StandardCopyOption;

import java.util.UUID;





@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class FileController {





    /*
    =====================================
    DOSSIER DE STOCKAGE
    =====================================
    */

    @Value("${app.upload.dir}")
    private String uploadDir;









    /*
    =====================================
    UPLOAD FICHIER
    =====================================

    React

    POST /api/files/upload

    MultipartFile file


    Retour :

    {
       fileName:"",
       fileType:"",
       fileUrl:""
    }

    =====================================
    */


    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(


            @RequestParam("file")
            MultipartFile file


    )

    throws IOException {





        if(file.isEmpty()){


            return ResponseEntity
                    .badRequest()
                    .build();


        }









        Path folder =

                Paths.get(uploadDir);








        if(!Files.exists(folder)){


            Files.createDirectories(
                    folder
            );


        }









        String originalName =

                file.getOriginalFilename();








        String filename =


                UUID.randomUUID()

                +

                "_"

                +

                originalName;









        Path destination =

                folder.resolve(
                        filename
                );









        Files.copy(


                file.getInputStream(),


                destination,


                StandardCopyOption.REPLACE_EXISTING


        );









        String fileType =


                detectFileType(

                        file.getContentType()

                );









        FileUploadResponse response =


                new FileUploadResponse(


                        originalName,


                        fileType,


                        "/uploads/" + filename


                );









        return ResponseEntity.ok(

                response

        );



    }












    /*
    =====================================
    DETECTION TYPE FICHIER
    =====================================
    */


    private String detectFileType(

            String contentType

    ){





        if(contentType == null){


            return "FILE";


        }







        if(contentType.startsWith("image")){


            return "IMAGE";


        }








        if(contentType.startsWith("video")){


            return "VIDEO";


        }








        if(contentType.startsWith("audio")){


            return "AUDIO";


        }








        if(contentType.contains("pdf")){


            return "PDF";


        }








        return "DOCUMENT";



    }




}