const router=require("express").Router()
const nodemailer=require("nodemailer")
const Mail=require("../models/MailModel")

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})

router.post("/send",async(req,res)=>{

    try{

        const {subject,message,recipients}=req.body

        for(let email of recipients){

            await transporter.sendMail({
                from:process.env.EMAIL,
                to:email,
                subject:subject,
                text:message
            })
        }

        await Mail.create({
            subject,
            message,
            recipients,
            status:"Success"
        })

        res.json({
            success:true,
            message:"Mails sent successfully"
        })

    }catch(error){

        await Mail.create({
            ...req.body,
            status:"Failed"
        })

        res.status(500).json({
            success:false,
            message:error.message
        })
    }

})

router.get("/history",async(req,res)=>{

    const data=await Mail.find().sort({createdAt:-1})

    res.json(data)
})

module.exports=router