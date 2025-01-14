const express = require('express');
require('dotenv/config');
const bodyParser = require('body-parser');

const connectDB = require('./controllers/database');
const myRoute = require('./routes/routes');

// Server Initialization
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());

// Routes will be written here
app.use('/route', myRoute); 

// Server Listen Along with Database 
// connection(in case of data persistence)
// const PORT = 5500;
connectDB()
.then(()=> {
    console.log("Database connection established");
    app.listen(5500, (error) =>{
        if(!error)
            console.log("Server is Successfully Running, and App is listening on port "+ PORT)
        else 
            console.log("Error occurred, server can't start", error);
        }
    );
})
.catch((err) => {
    console.log("Database cannot connect");
    
})