package com.chatapp.chatapp.service;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;



@Service
public class FileStorageService {


    private final Path rootLocation =
            Paths.get("uploads");




    public FileStorageService(){


        try{

            if(!Files.exists(rootLocation)){

                Files.createDirectories(rootLocation);

            }

        }
        catch(IOException e){

            throw new RuntimeException(
                    "Erreur création uploads",
                    e
            );

        }

    }







    public String storeFile(MultipartFile file){


        try{


            String original =
                    file.getOriginalFilename();


            String extension="";


            if(original!=null && original.contains(".")){


                extension =
                        original.substring(
                                original.lastIndexOf(".")
                        );

            }



            String filename =
                    UUID.randomUUID()
                    +
                    extension;



            Path destination =
                    rootLocation.resolve(filename);




            Files.copy(

                    file.getInputStream(),

                    destination,

                    StandardCopyOption.REPLACE_EXISTING

            );




            return "/uploads/"+filename;



        }
        catch(IOException e){


            throw new RuntimeException(
                    "Erreur upload",
                    e
            );

        }


    }






    public String detectType(String contentType){


        if(contentType==null)
            return "DOCUMENT";


        if(contentType.startsWith("image"))
            return "IMAGE";


        if(contentType.startsWith("video"))
            return "VIDEO";


        if(contentType.startsWith("audio"))
            return "AUDIO";


        return "DOCUMENT";


    }




}