const mongoose =require('mongoose');
const ProductSchema =new mongoose.Schema({
    name:String,
    price:String,
    category:String,
    userid:String

});
module.exports= mongoose.model("addproduct",ProductSchema);