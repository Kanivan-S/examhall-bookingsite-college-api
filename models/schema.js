const mongoose =  require('mongoose');
const Schema = mongoose.Schema;

const userdataSchema = new Schema({
    name: String,
    mail:String,
    password: String
});
const admindataSchema=new Schema({
    name:String,
    mail:String,
    password:String,
})


const categorySchema=new Schema({
    cname:String,
    info:String,
})
const roomschema=new Schema({
    rname:String,
    rinfo:String,
    catid:String,
})

const roombookschema=new Schema({
    rid:String,
    cid:String,
    sdate:{type:Date},
    starttime:{type:Date},
    endtime:{type:Date},
    lastModified:{type:Date,default:Date.now},
    bookedby:String,
})

const rejectionroomschema=new Schema({
    rid:String,
    cid:String,
    sdate:{type:Date},
    starttime:{type:Date},
    endtime:{type:Date},
    status:Number,
    lastModified:{type:Date,default:Date.now},
    bookedby:String,
})
// status : 1-book | 2- reject | 3-pending/others
const Userdata = mongoose.model("c",userdataSchema,"userdata");
const Admindata=mongoose.model("b",admindataSchema,"admindata");

const Catdata= mongoose.model("d",categorySchema,"category");
const Roomdata=mongoose.model("a",roomschema,"roomdetails");

const Roombooking= mongoose.model("e",roombookschema,"bookingstatus");
const RejectBooking=mongoose.model("f",rejectionroomschema,"rejectedbooking")
module.exports = {Userdata,Admindata,Catdata,Roomdata,Roombooking,RejectBooking};





// db.bookingstatus.find({starttime: { $gt:new Date('1900'),$lt:new Date('2024')}}).count()

// db.bookingstatus.find({starttime: { $gt:new Date('1900'),$lt:new Date('2024')}}).count()



// db.example.find( {
//    $or: [
//       { x: { $eq: 0 } },
//       { $expr: { $eq: [ { $divide: [ 1, "$x" ] }, 3 ] } }
//    ]
// } )

// db.bookingstatus.find(
//     {
//         $or:[
//             { starttime:{ $gt :new Date("1900")}, endtime : { $lt :new Date(" 2022")}
//             },
//             {starttime:{ $gt :new Date("1900")}, endtime : { $lt :new Date(" 2022")}
//             },
//             { starttime: {$lt:new Date("1800")}, endtime : {$gt:new Date("2025")}
//             }
//         ]
//     }
// )

// db.bookingstatus.find({$or :[ {$and:[ {starttime:{$gt:new Date("1900")}}, {endtime: {$lt :new Date ("2023")}}]}  , {$and:[ {starttime:{$gt:new Date("1900")}}, {endtime: {$lt :new Date ("2023")}}]} , {$and:[ {starttime:{$lt:new Date("2024")}}, {endtime: {$gt :new Date ("2024")}}]}  ]} )



// Roombooking.find({
//     $or :[ 
//         {$and:[ {starttime:{$gte:new Date("s")}}, {endtime: {$lte :new Date ("s")}}]}  ,
//          {$and:[ {starttime:{$gte:new Date("e")}}, {endtime: {$lt :new Date ("e")}}]} ,
//           {$and:[ {starttime:{$lt:new Date("2024")}}, {endtime: {$gt :new Date ("e")}}]} 
//      ]
// ,{sdate :{$eq : new Date("date")}}} );


// var bookedroomsondate= Roombooking.find({ "$or":[ {"$and":[ {"starttime":{"$gte":new Date(stim)}}, {"endtime": {"$lte" :new Date (stim)}}]} ,{"$and":[ {"starttime":{"$gte":new Date(etim)}}, {"endtime": {"$lt" :new Date (etim)}}]} ,{"$and":[ {"starttime":{"$lt":new Date(stim)}}, {"endtime": {"$gt" :new Date (etim)}}]} ]});
