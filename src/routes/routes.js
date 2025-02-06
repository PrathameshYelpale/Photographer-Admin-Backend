const express = require("express");
const Package = require("../model/packages");
const UserSignUp = require("../model/userSignup");
const addClient = require("../model/addClient");
const { validateSignUpData } = require("../utilis/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")


const authRoute = express.Router();

authRoute.post("/addClient", async (req, res) => {
  try {
    const client = req.body; // Expect JSON data in request body
    console.log(client);

    const newClient = new addClient(client);
    await newClient.save();
    res.status(200).send({ message: "Client added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding client", error });
  }
});

authRoute.post("/addPackages", async (req, res) => {
  try {
    const packages = req.body; // Expect JSON data in request body
    console.log(packages);

    await Package.insertMany(packages);
    res.status(200).send({ message: "Packages added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding packages", error });
  }
});

authRoute.post("/signup", async (req, res) => {
  try {

    validateSignUpData(req)
    const { firstName, lastName, gender, place, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10)

    const user = new UserSignUp({
      firstName,
      lastName,
      gender,
      place,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token)
    res.json({ message: "user added successfully", data: savedUser });
  } catch (error) {
    console.error(error);
    res.status(400).send("send the error message" + error.message);
  }
});

authRoute.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const userLogin = await UserSignUp.findOne({ emailId: emailId });
    if (!userLogin) {
      throw new Error("Email Id is not correct");
    }

    const isPasswordValid = await userLogin.validatePassword(password)

    if (isPasswordValid) {

      const token = await userLogin.getJWT()

      res.cookie("token", token)

      // res.send("Login Successfully !!!")
      res.send(userLogin)
    } else {
      throw new Error("Password is not correct");
    }

  } catch (error) {
    res.status(400).send("Error sending the user, " + error.message)
  }
})

authRoute.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  }).send("logout successfully !!!")
})

module.exports = authRoute;
