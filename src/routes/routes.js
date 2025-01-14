const express = require('express');
const Route = express.Router();
const Package = require('../model/packages');

Route.post('/add-packages', async (req, res) => {
    try {
        const packages = req.body; // Expect JSON data in request body
        console.log(packages);
        
        await Package.insertMany(packages);
        res.status(200).send({ message: 'Packages added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error adding packages', error });
    }
})

module.exports = Route;