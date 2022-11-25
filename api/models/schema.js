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

const Admindata=mongoose.model("a",admindataSchema,"admindata");
const Userdata = mongoose.model("u",userdataSchema,"userdata");

module.exports = [Userdata,Admindata];