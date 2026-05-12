const mongoose=require("mongoose")

const MailSchema=new mongoose.Schema({
    subject:String,
    message:String,
    recipients:[String],
    status:String,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Mail",MailSchema)