var express = require('express');
var router = express.Router();
var schemas=require("../models/schema");
var User=schemas[0];
var Admin=schemas[1];

router.post('/login',async (req,res)=>{

    if(req.body.role=="1"){
        //auth for admin

        var gotadmin_mail=(req.body.mail);//mail from the post req
        try{
            var obj=await Admin.findOne({mail:gotadmin_mail});
            if(obj!=null){
                const adminmail=obj.mail;
                const adminpswd=obj.password;
    
                if(gotadmin_mail==adminmail && req.body.password==adminpswd && req.body.role=="1"){
                    res.status(200).json({accept:"1",role:"1"});
                }
                else{res.status(401).json({message:"admin no wrong credentials"});}
            }  
            else{
                res.status(401).json({message:"admin no wrong credentials"});
            }
            
            
        }
        catch(err){
            res.status(401).json({message:"admin no wrong credentials"});

        }
        
        
    }
    else if(req.body.role=="2"){
        //auth for users
        var gotmail=(req.body.mail);
        try{
            var obj=await User.findOne({mail:gotmail});
            if(obj!=null){
                const usermail=obj.mail;
                const userpswd=obj.password;
        
                if(gotmail==usermail && req.body.password==userpswd){
                    res.status(200).json({accept:"1",role:"2"});
                }
                else{
                    res.status(401).json({message:"user wrong credentials"});
                }
            }
            else{
                res.status(401).json({message:"user wrong credentials"});
            }

        }
        catch(err){
            res.status(404).json({message:"user no  credentials"});
        }
    }
    else{
        res.status(401).json({message:"wrong  credentials"});
    }  
})


router.post('/register',async (req,res)=>{
    var gotmail=req.body.mail;
    try{
        var obj=await User.findOne({mail:gotmail});
        if(obj==null){
            const usrname=req.body.uname;
            const userpswd=req.body.password;
            console.log(gotmail," ",usrname," ",userpswd);
            try{
                await User.create({name:usrname,mail:gotmail,password:userpswd});
                return res.status(200).json({register:"1"});
            }catch(err){
                console.log(err);
                return res.status(401).json({message:"can't register!"});
            }   
        }
        else{
            return res.status(401).json({message:"Already exists!"});
        }
    }
    catch(errr){
        res.status(404).json({message:"Error occured"});
    }

})
module.exports=router;