// has the  shared  functions
var express = require('express');
var router = express.Router();
var schemas=require("../models/schema");
var {Userdata,Admindata,Catdata,Roomdata,Roombooking,RejectBooking}=require("../models/schema");

var User=Userdata
var Admin=Admindata
var Category=Catdata
var Rooms=Roomdata


router.post('/availrooms',async (req,res)=>{
    console.log(req.body);
    var stim=new Date(req.body.sdate+" "+req.body.fromtime);
    var etim=new Date(req.body.sdate+" "+req.body.totime);
    if(stim>=etim){
        return res.json({"availrooms":[]});
    }

    // console.log(STIM);
    try{
        // var avail_rooms=await Rooms.find({cid:req.body.cid});
    
            // var bookedroomsondate=await Roombooking.find( { $and:[ {cid:req.body.cid}  ,{"$or":[{starttime:new Date(stim)},{endtime:new Date(etim)} ,{"$and":[ {"starttime":{"$gt":new Date(stim)}}, {"endtime": {"$lt" :new Date (stim)}}]} ,{"$and":[ {"starttime":{"$gt":new Date(etim)}}, {"endtime": {"$lt" :new Date (etim)}}]} ,
            // { "$and":[ {"starttime":{"$lt":new Date(stim)}}, {"endtime": {"$gt" :new Date (etim)}}]} ]} ]}, {rid:1 , _id : 0 } ) ;
            var bookedroomsondate= await Roombooking.find({cid:req.body.cid},{rid:1,sdate:1,starttime:1,endtime:1,_id:0});
            let barr=[];

            for(let i=0;i<bookedroomsondate.length;i++){
                var start=bookedroomsondate[i].starttime;
                var end=bookedroomsondate[i].endtime;
                if(stim>end || etim<start){
                    continue;
                }
                if((start <=stim && end >=stim)&&(start <=etim && end >=etim)){
                    barr.push(bookedroomsondate[i].rid);
                }
                else if(start <=stim && end >=stim){
                    barr.push(bookedroomsondate[i].rid);
                }
                else if(start <=etim && end >=etim){
                    barr.push(bookedroomsondate[i].rid);
                }
                else if( stim<=start && etim >=end){
                    barr.push(bookedroomsondate[i].rid);
                }

            }

      
        // var bookedroomsondate=await Roombooking.find({ { "$or":[ {"$and":[ {"starttime":{"$gte":new Date(stim)}}, {"endtime": {"$lte" :new Date (stim)}}]} ,{"$and":[ {"starttime":{"$gte":new Date(etim)}}, {"endtime": {"$lte" :new Date (etim)}}]} ,{"$and":[ {"starttime":{"$lte":new Date(stim)}}, {"endtime": {"$gte" :new Date (etim)}}]} ]},{cid:req.body.cid}},{rid:1,_id:0});
        // console.log("llll+++",bookedroomsondate);
        
        // for(let i=0;i<bookedroomsondate.length;i++){
        //     barr.push(bookedroomsondate[i].rid);
        // }
        // console.log(barr);
        var avail=await Roomdata.find({$and :[{ _id : {$nin:barr}}, {catid:req.body.cid }]});
        // console.log(req.body.cid);
        if(avail!=null){
            // console.log("-- "+avail);
            // avail=[];
            return res.json({"availrooms":avail});
        }
        else{
            console.log(bookedroomsondate);
            return res.status(401).json({"availrooms":"avail_rooms"});
        }
       
    }
    catch(err){ 
        console.log(err);
        return res.json({"availrooms":"Error "+err});
    }
})

router.post('/bookroom',async (req,res)=>{
    console.log(req.body);
    if(req.body.role=="1" || req.body.role=="2"){
        try{
            //also userid is valid 
            var isroom=await Rooms.find({_id:req.body.rid,catid:req.body.catid}).count();
            var iscat=await Category.find({_id:req.body.catid}).count();
            if(isroom ==1 && iscat==1){
                try{
                    var book=await Roombooking.create({
                        rid:req.body.rid,
                        cid:req.body.catid,
                        // sdate:new Date(req.body.sdate),
                        sdate:req.body.sdate,
                        starttime:new Date(req.body.sdate+" "+req.body.starttime),
                        endtime:new Date(req.body.sdate+" "+req.body.endtime),
                        status:1,
                        bookedby:req.body.userid,
                    })   
                    return res.json({message:"Addded Successfully"});
                }
                catch(err){
                    return res.json({message:"Error in booing the room "});

                }
            }
            else{
                return res.json({message:"Error in category room details!"});
            }
        }
        catch(err){console.log(err);return res.json({message:"Error in booking  room!"});}

    }
    else{
        return res.json({message:"booked"});
    }

    

})

router.post('/userhistory',async(req,res)=>{
    if(req.body.role=="2" || req.body.role=="1"){
        //to check userid is valid
        try{
            
            var isvalid_user;
            if(req.body.role=="2"){
                var isvalid_user=await User.find({_id:req.body.uid}).count();
            }
            else if(req.body.role=="1"){
                var isvalid_user=await Admin.find({_id:req.body.uid}).count();
            }
            if(isvalid_user==1){
                var arr=await Roombooking.find({bookedby:req.body.uid});
                var senddata=[];
                for(let i=0;i<arr.length;i++){
                    
                    var cf=await Category.findOne({_id:arr[i].cid},{cname:1,_id:0});
                    var ar=await Rooms.findOne({_id:arr[i].rid},{rname:1,_id:0});
                    let g={
                        catname:cf.cname,
                        rname:ar.rname,
                        sdate:(arr[i].sdate.getDate()+ '/'+(arr[i].sdate.getMonth()+1)+'/'+arr[i].sdate.getFullYear()),
                        fromtime:(arr[i].starttime.getHours()+" : "+arr[i].starttime.getMinutes()),
                        totime:(arr[i].endtime.getHours()+" : "+arr[i].endtime.getMinutes()),
                        status:"Booked",
                    }
                    console.log(arr[i].status+ g.status);
                    senddata.push(g);
                }

                console.log(senddata);
                return res.json({flag:"1",historylist:senddata});
            }
            else{
                return res.json({flag:"0",message:"Invalid user"});
            }
        }
        catch(err){
            console.log(err);
            return res.json({flag:"0",message:"Error in fetching history!"});
        }
    }
})
router.post('/rejecthistory',async(req,res)=>{
    if(req.body.role=="2" || req.body.role=="1"){
        //to check userid is valid
        try{
            
            var isvalid_user;
            if(req.body.role=="2"){
                var isvalid_user=await User.find({_id:req.body.uid}).count();
            }
            else if(req.body.role=="1"){
                var isvalid_user=await Admin.find({_id:req.body.uid}).count();
            }
            if(isvalid_user==1){
                var arr=await RejectBooking.find({bookedby:req.body.uid});
                var senddata=[];
                for(let i=0;i<arr.length;i++){
                    
                    var cf=await Category.findOne({_id:arr[i].cid},{cname:1,_id:0});
                    var ar=await Rooms.findOne({_id:arr[i].rid},{rname:1,_id:0});
                    let g={
                        catname:cf.cname,
                        rname:ar.rname,
                        sdate:(arr[i].sdate.getDate()+ '/'+(arr[i].sdate.getMonth()+1)+'/'+arr[i].sdate.getFullYear()),
                        fromtime:(arr[i].starttime.getHours()+" : "+arr[i].starttime.getMinutes()),
                        totime:(arr[i].endtime.getHours()+" : "+arr[i].endtime.getMinutes()),
                    }
                    senddata.push(g);
                }

                console.log(senddata);
                return res.json({flag:"1",rejectlist:senddata});
            }
            else{
                return res.json({flag:"0",message:"Invalid user"});
            }
        }
        catch(err){
            console.log(err);
            return res.json({flag:"0",message:"Error in fetching history!"});
        }
    }
})

module.exports=router;