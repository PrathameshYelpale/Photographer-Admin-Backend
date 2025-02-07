const mongoose = require("mongoose");
const validator = require("validator");

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
        type: Date,
        required: true,
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

const addClient = mongoose.model("ClientDB", clientSchema);

module.exports = addClient;