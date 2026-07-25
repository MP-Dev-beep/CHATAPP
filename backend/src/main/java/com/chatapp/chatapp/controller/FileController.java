package com.chatapp.chatapp.controller;


import com.chatapp.chatapp.dto.FileUploadResponse;
import com.chatapp.chatapp.service.FileStorageService;


import lombok.RequiredArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class FileController {



    private final FileStorageService fileStorageService;







    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> upload(

            @RequestParam("file")
            MultipartFile file

    ){



        String url =

                fileStorageService.storeFile(file);





        FileUploadResponse response =

                new FileUploadResponse(

                        file.getOriginalFilename(),

                        fileStorageService.detectType(
                                file.getContentType()
                        ),

                        url,

                        file.getSize()

                );




        return ResponseEntity.ok(response);



    }





}