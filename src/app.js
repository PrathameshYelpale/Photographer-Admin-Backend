const express = require('express');
require('dotenv/config');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser")
const connectDB = require('./controllers/database');
const cors = require("cors")

// Server Initialization
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
// const PORT = process.env.PORT;
const PORT = 5500;
const authRouter = require("./routes/routes")

// Routes will be written here
app.use('/', authRouter);

connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(PORT, (error) => {
            console.log('PORT: ', PORT);
            if (!error)
                console.log("Server is Successfully Running, and App is listening on port " + PORT)
            else
                console.log("Error occurred, server can't start", error);
        }
        );
    })
    .catch((err) => {
        console.log("Database cannot connect");
    })