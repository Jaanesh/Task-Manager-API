const express=require('express');


const router=express.Router();

const auth=require('../middleware/auth');

const UserModel=require('../models/user');

const emailService=require('../emails/account');

const sharp=require('sharp');

const multer  = require('multer');


let upload=multer({
   // dest:'avatars', use it only when u want to store files in local storage
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
         if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
               return cb(new Error('Please upload a image in jpg/jpeg/png format'));
         }

         cb(undefined,true);

    }
});

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{

    const buffer=await sharp(req.file.buffer).resize({width:250,height:250})
                                .png()
                                .toBuffer();


    req.user.avatar=buffer;
    
    await req.user.save();  

    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

router.delete('/users/me/avatar',auth,async (req,res)=>{

    req.user.avatar=undefined;
    
    await req.user.save();  

    res.send();
},(error,req,res,next)=>{
    res.status(400).send({error:error.message});
});

router.get('/users/:id/avatar',async (req,res)=>{

    try{
       
         const user=await UserModel.findById(req.params.id);

         if(!user || !user.avatar){
             throw new Error();
         }

         res.set('Content-Type','image/jpg');
         res.send(user.avatar);

    }catch(e){
        res.status(400).send();
    }
});

router.post('/users',async (req,res)=>{
      
    try{
        let newUser=new UserModel(req.body);

        await newUser.save();       

        emailService.sendWelcomeEmail(newUser.email,newUser.name);
       

        const token=await newUser.generateAuthToken();  
        
        res.status(201).send({newUser,token});

    }catch(error){
        res.status(400).send(error);
    }     
});

 router.get('/users',auth,async (req,res)=>{

    try{
        let users=await UserModel.find({});
        res.send(users);
    }catch(error){
        res.status(500).send(error);
    }
  
}); 

router.get('/users/me',auth,async (req,res)=>{ 
        // req.user comes from the auth.js middleware  
        res.send(req.user);  
});

router.get('/users/:id',async (req,res)=>{

    try{
        let _id=req.params.id;
        let user=await  UserModel.findById(_id);

        if(!user){
            return res.status(404).send();
        }

        res.send(user);

    }catch(error){
        res.status(500).send(error);
    }
      
});

router.patch('/users/me',auth,async (req,res)=>{

    try{

               
       /*
       //thiswill be enough to update.. but ifwe want to has password while update this is not enougth
       let options={
            new:true,
            runValidators:true
        }

        let user=await  UserModel.findByIdAndUpdate(_id,objectToBeUpdated,options); */

        //first find the user
      /*   let user=await  UserModel.findById(_id);      

        if(!user){
            return res.status(404).send();
        } */

        //next check if the update obj contains password property to update
        
        const updatePropertiesInRequest=Object.keys(req.body);

        updatePropertiesInRequest.forEach(property => {
            req.user[property]=req.body[property];
        });     

        //while running save the pre link middleware gets executed
        await req.user.save();

        res.send(req.user);
        
    }catch(error){
       res.status(400).send(error);
    }
})

router.delete('/users/me',auth ,async (req,res)=>{
    try{
        //let _id=req.params.id;
        //req.user._id comes from the auth.js 
        /* let _id=req.user._id;
        let user=await  UserModel.findByIdAndDelete(_id);

        if(!user){
            return res.status(404).send();
        }

        res.send(user); */
        emailService.sendAccountCancellationEmail(req.user.email,req.user.name);
        await req.user.remove();

        
        res.send(req.user);
    }catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/login',async (req,res)=>{

     try{      

         const user=await UserModel.findByCredentails(req.body.email,req.body.password);

         const token=await user.generateAuthToken();

         if(!user){
             return res.status(404).send();
         }

         res.send({user,token});


     }catch(e){
        res.status(400).send(e);
     }


});

router.post('/users/logout',auth,async (req,res)=>{
    try{
         req.user.tokens=req.user.tokens.filter((token)=>{
                return token.token !==  req.token ;
         });

         await req.user.save();

         res.send();

    }catch(e){
          res.status(500).send(e);
    }
});

router.post('/users/logoutall',auth,async (req,res)=>{
    try{

        req.user.tokens=[];
        await req.user.save();
        res.send();

    }catch(e){
        res.status(500).send(e);
    }
});



module.exports=router;
