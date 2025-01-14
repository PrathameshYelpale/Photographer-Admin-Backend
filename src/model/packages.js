const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    type: String,
    detailsOfPackage: Array,
    id: String
});

const Package = mongoose.model('PackagesDB', packageSchema);

module.exports = Package;