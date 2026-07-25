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


                Files.createDirectories(
                        rootLocation
                );


            }


        }

        catch(IOException e){


            throw new RuntimeException(

                    "Impossible de créer le dossier uploads",

                    e

            );


        }


    }










    public String storeFile(

            MultipartFile file

    ){



        try{


            String originalName =

                    file.getOriginalFilename();





            String extension = "";



            if(originalName != null && originalName.contains(".")){


                extension =

                        originalName.substring(

                                originalName.lastIndexOf(".")

                        );


            }







            String fileName =

                    UUID.randomUUID()

                    +

                    extension;









            Path destination =

                    rootLocation.resolve(

                            fileName

                    );








            Files.copy(

                    file.getInputStream(),

                    destination,

                    StandardCopyOption.REPLACE_EXISTING

            );









            return "/uploads/" + fileName;





        }

        catch(IOException e){



            throw new RuntimeException(

                    "Erreur sauvegarde fichier",

                    e

            );


        }




    }









    public void deleteFile(

            String fileUrl

    ){



        try{


            if(fileUrl == null){

                return;

            }






            Path file =

                    Paths.get(

                            fileUrl.replace(

                                    "/uploads/",

                                    "uploads/"

                            )

                    );





            Files.deleteIfExists(file);



        }

        catch(IOException e){


            System.out.println(

                    "Erreur suppression fichier"

            );


        }


    }




}