const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());


// Root Route
app.get("/", (req, res) => {

    res.send(
        "Bulk Mail API Running"
    );
});


// MongoDB
mongoose.connect(
    process.env.MONGO_URL
)
.then(() => {

    console.log(
        "DB Connected"
    );
})
.catch((err) => {

    console.log(
        err
    );
});


// Routes
app.use(
    "/api/mail",
    require(
        "./routes/mailRoute"
    )
);


// Render Port
const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            "Server Running"
        );
    }
);