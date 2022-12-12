// has the admin previlege functions
const { response } = require('express');
var express = require('express');
var router = express.Router();
// var cmfns=require("./commonfns.js");
// var schemas=require("../models/schema");
// var Category=schemas[2];
// var Roomdetails=schemas[3];
// var Roombooking=schemas[4];
// var User=schemas[0];
// var rejectBooking=schemas[5];
var {Userdata,Admindata,Catdata,Roomdata,Roombooking,RejectBooking}=require("../models/schema");


router.post('/addnewCategory',async (req,res)=>{
    if(req.body.role=="1"){
        var catname=(req.body.catname);
        var catinfo=(req.body.catinfo);
        try{
            var obj=await Catdata.find({cname:{$eq:catname}}).count();
            if(obj!=null && obj==0){
                await Catdata.create({cname:catname,info:catinfo});
                return res.status(200).json({message:"created"});
            }
            else{
                console.log("Cat name already exists");
                // response.status(400).send(new Error('Category name already exists'));
                return res.json({message:"Category name already exists"});
            }

        }
        catch(err){
           return response.json({message:"Fetch error-addnewCategory"});

        }
    }
    else{
        return res.json({message:"admin  wrong credentials - addnewCategory"});
    }
})
router.post('/addNewRoom',async (req,res)=>{
    if(req.body.role=="1"){
        var cid=req.body.cid;
        try{
            var cat_isthere=await Catdata.find({_id:cid}).count();
            if(cat_isthere==1){//to check the category is there in category db
                var room_name=req.body.rname;
                var room_info=req.body.rinfo;
                var j=await Roomdata.find({catid:cid,rname:room_name}).count();//to check roomname already there
                if(j==0){
                    var update_query=await Roomdata.create({rname:room_name,rinfo:room_info,catid:cid});
                    console.log("Updated!");
                    return res.json({message:"Added new room !"});
        
                }else{
                    console.log("Room already available in that category - addNewRoom");
                    return res.json({message:"Room already available in that category"});
                }

            }
            else{
                console.log("Category doesn't exist");
                return res.json({message:"Invalid Category "});
            }

        }
        catch(err){console.log(err);return res.json({message:"Error in adding new room!"});}

    }
    return res.status(401).json({message:"admin  wrong credentials - addnewCategory"});

})

router.get('/getCategory',async (req,res)=>{
    try{
        var obj=await Catdata.find({},{cname:1});
        console.log(obj);
         return res.status(200).json(obj);
    }
    catch(err){
         return res.status(500).json({message:"Fetch error - getcategory : "+err});
    }
})
router.post('/getRooms',async (req,res)=>{

    try{
        var obj=await Roomdata.find({catid:req.body.catid},{rname:1});
        console.log(obj);
        return res.status(200).json(obj);
    }
    catch(err){
        return res.status(401).json({message:"Error in getting rooms"});
    }
})
router.post('/roomstatusList',async (req,res)=>{
    try{
        var obj=await Roombooking.find({cid:req.body.cid,rid:req.body.rid,sdate:req.body.sdate,status:1},{starttime:1,endtime:1,bookedby:1});//status=1 to get the booked room ..
        var senddata=[];
        if(obj!=null){
            for(let i=0;i<obj.length;i++){

                var uname=await Userdata.findOne({_id:obj[i].bookedby},{name:1,_id:0});
                console.log(uname);
                if(uname==null){
                   
                    let g={
                        bookid:obj[i]._id,
                        username:"admin",
                        start:((obj[i].starttime.getHours())+" : "+(obj[i].starttime.getMinutes())),
                        end:(obj[i].endtime.getHours())+" : "+(obj[i].endtime.getMinutes()),
                    }
                    senddata.push(g);
                }
                else{
                    let g={
                        bookid:obj[i]._id,
                        username:uname.name,
                        start:((obj[i].starttime.getHours())+" : "+(obj[i].starttime.getMinutes())),
                        end:(obj[i].endtime.getHours())+" : "+(obj[i].endtime.getMinutes()),
                    } 
                    senddata.push(g);
                }
                
               
            }
            console.log(senddata);
            return res.json({count:senddata.length,perroomStatus:senddata});
            
        }
        else{
            console.log("count is zero!");
            return res.json({count:0,message:"No Room Booking"});
        }
    }catch(err){
        console.log("error bro!",err);
        return res.json({message:"Error in getting roomstatus List"});
    }
})

router.post('/rejectBooking',async (req,res)=>{
    try{
        if(req.body.role=="1"){
            console.log("ghjk ",req.body.bookid);
            var obj=await Roombooking.findById(req.body.bookid,{_id:0,__v:0,lastModified:0});
            if(obj!=null){
                console.log(obj);
                // const rej=new RejectBooking(obj);
                // console.log(rej)
                
                let nm={
                    rid: obj.rid,
                    cid: obj.cid,
                    sdate: obj.sdate,
                    starttime: obj.starttime,
                    endtime:obj.endtime,
                    bookedby: obj.bookedby,
                  }
                  const result = await RejectBooking.create(nm);
                await Roombooking.findOneAndDelete({_id:req.body.bookid});
                return res.json({message:"Rejected Successfully"});
            }
            // }else if(obj.length==0){
            //     return res.json({message:"Error No booking for this room  "})
            // }
            else{
                return res.json({message:"Error in Reject Booking count of id"});
            }
        }
        else{
            return res.json({message:"Wrong admin credentials  - rejectBooking"});
        }
    }
    catch(err){
        console.log(err);
        return res.json({message:"Error in Reject Booking "+err});
    }
})

module.exports=router;