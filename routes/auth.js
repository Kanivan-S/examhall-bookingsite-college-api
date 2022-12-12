var express = require('express');
var router = express.Router();
// var schemas=require("../models/schema");
// var User=schemas[0];
// var Admin=schemas[1];

var {Userdata,Admindata,Catdata,Roomdata,Roombooking,RejectBooking}=require("../models/schema");


router.post('/login',async (req,res)=>{

    if(req.body.role=="1"){
        //auth for admin

        var gotadmin_mail=(req.body.mail);//mail from the post req
        try{
            var obj=await Admindata.findOne({mail:gotadmin_mail});

            if(obj!=null){
                const adminmail=obj.mail;
                const adminpswd=obj.password;
                const admin_id=obj._id;
                console.log(admin_id);
                if(gotadmin_mail==adminmail && req.body.password==adminpswd && req.body.role=="1"){
                    res.status(200).json({accept:admin_id,role:"1",name:obj.name});
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
            var obj=await Userdata.findOne({mail:gotmail});
            if(obj!=null){
                const usermail=obj.mail;
                const userpswd=obj.password;
                const user_id=obj._id;
        
                if(gotmail==usermail && req.body.password==userpswd){
                    res.status(200).json({accept:user_id,role:"2",name:obj.name});
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
        var obj=await Userdata.findOne({mail:gotmail});
        if(obj==null){
            const usrname=req.body.uname;
            const userpswd=req.body.password;
            try{
                await Userdata.create({name:usrname,mail:gotmail,password:userpswd});
                var obj=await Userdata.findOne({mail:gotmail});
               return res.status(200).json({accept:obj._id,role:"2",name:obj.name});
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