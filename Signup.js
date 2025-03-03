const mongoose =require('mongoose');
const signupuserSchema =new mongoose.Schema({
    name:String,
    email:String,
    password:String

});
module.exports= mongoose.model("Signupuser",signupuserSchema);
