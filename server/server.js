const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
require("dotenv").config()

const app=express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err))

app.use("/api/mail",require("./routes/mailRoute"))

app.listen(5000,()=>{
    console.log("Server Running")
})