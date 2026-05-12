const router = require("express").Router();
const nodemailer = require("nodemailer");
const Mail = require("../models/MailModel");

const transporter =
    nodemailer.createTransport({

        host:
            "smtp.gmail.com",

        port:
            587,

        secure:
            false,

        requireTLS:
            true,

        auth: {

            user:
                process.env.EMAIL,

            pass:
                process.env.PASSWORD
        },

        tls: {

            servername:
                "smtp.gmail.com"
        }
    });
router.post("/send", async (req, res) => {

    try {

        const {
            subject,
            message,
            recipients
        } = req.body;

        if (
            !subject ||
            !message ||
            !recipients?.length
        ) {

            return res
            .status(400)
            .json({
                success: false,
                message:
                    "All fields are required"
            });
        }

        console.log(
            "Sending mails..."
        );

        // Send once to all recipients
        const info =
            await transporter.sendMail({

                from:
                    process.env.EMAIL,

                to:
                    recipients.join(","),

                subject:
                    subject,

                text:
                    message
            });

        console.log(
            "Mail sent:",
            info.response
        );

        // Save in MongoDB
        await Mail.create({

            subject,

            message,

            recipients,

            status:
                "Success"
        });

        return res
        .status(200)
        .json({

            success: true,

            message:
                "Mails sent successfully"
        });

    } catch (error) {

        console.log(
            "MAIL ERROR:"
        );

        console.log(
            error.message
        );

        return res
        .status(500)
        .json({

            success: false,

            message:
                error.message
        });
    }
});

router.get(
    "/history",
    async (req, res) => {

        const data =
            await Mail.find()
            .sort({
                createdAt: -1
            });

        res.json(data);
    }
);

module.exports = router;