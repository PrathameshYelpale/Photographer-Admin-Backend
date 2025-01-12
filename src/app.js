// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();

// 3rd Party Modules
const express = require('express');
require('dotenv/config');

// Local Modules
// const myRoute = require('./routes/myRoute.js');

// Server Initialization
const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());

// Routes will be written here
// app.use('/route', myRoute); 

// Server Listen Along with Database 
// connection(in case of data persistence)
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);