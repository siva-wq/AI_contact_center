const Mongo = require("mongoose");
const { Language } = require("node-nlp");

const userSchema = new Mongo.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"agent"
    }
})

module.exports = Mongo.model("User",userSchema);