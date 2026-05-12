const router = require("express").Router();
const nodemailer = require("nodemailer");
const Mail = require("../models/MailModel");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post("/send", async (req, res) => {

    try {

        const { subject, message, recipients } = req.body;

        // Validation
        if (!subject || !message || !recipients?.length) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        console.log("Sending mails...");
        console.log("Recipients:", recipients);

        // Send mails
        for (const email of recipients) {

            const info =
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: subject,
                    text: message
                });

            console.log(
                "Mail sent:",
                info.response
            );
        }

        // Save success
        await Mail.create({
            subject,
            message,
            recipients,
            status: "Success"
        });

        return res.json({
            success: true,
            message:
                "Mails sent successfully"
        });

    } catch (error) {

        console.log(
            "MAIL ERROR:"
        );

        console.log(error);

        try {

            await Mail.create({
                ...req.body,
                status: "Failed"
            });

        } catch (dbError) {

            console.log(
                "DB ERROR:"
            );

            console.log(dbError);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get(
    "/history",
    async (req, res) => {

        try {

            const data =
                await Mail.find()
                .sort({
                    createdAt: -1
                });

            return res.json(data);

        } catch (error) {

            console.log(error);

            return res
            .status(500)
            .json({
                message:
                    error.message
            });
        }
    }
);

module.exports = router;