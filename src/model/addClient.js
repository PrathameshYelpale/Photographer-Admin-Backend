const mongoose = require("mongoose");
const validator = require("validator");
const moment = require("moment");

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    address: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new Error("Enter correct mobile number");
            }
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter correct email ID");
            }
        },
    },
    orderDate: {
        type: String, // Change to String to store formatted date
        required: true,
        validate(value) {
            if (!moment(value, "DD MMMM YYYY", true).isValid()) {
                throw new Error("Enter correct date in format 'DD MMMM YYYY'");
            }
        },
    },
    Package: {
        type: Array,
        required: true,
    },
    remarks: {
        type: String,
        // required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Middleware to format date before saving
clientSchema.pre('save', function (next) {
    if (this.orderDate) {
        this.orderDate = moment(this.orderDate, "DD MMMM YYYY").format("DD MMMM YYYY");
    }
    next();
});

// Middleware to format date after retrieving
clientSchema.post('init', function (doc) {
    if (doc.orderDate) {
        doc.orderDate = moment(doc.orderDate, "DD MMMM YYYY").format("DD MMMM YYYY");
    }
});

const addClient = mongoose.model("ClientDB", clientSchema);

module.exports = addClient;