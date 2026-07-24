package com.chatapp.chatapp.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;



@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(
        origins="http://localhost:5173",
        allowCredentials="true"
)
public class FileController {


    @Value("${app.upload.dir}")
    private String uploadDir;



    @PostMapping("/upload")
    public ResponseEntity<String> upload(
            @RequestParam("file") MultipartFile file
    )
    throws IOException {



        Path folder =
                Paths.get(uploadDir);



        if(!Files.exists(folder)){

            Files.createDirectories(folder);

        }




        String filename =

                UUID.randomUUID()
                +
                "_"
                +
                file.getOriginalFilename();




        Path path =

                folder.resolve(filename);



        Files.copy(

                file.getInputStream(),

                path,

                StandardCopyOption.REPLACE_EXISTING

        );




        return ResponseEntity.ok(

                "/files/" + filename

        );


    }


}