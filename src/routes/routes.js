const express = require("express");
const Package = require("../model/packages");
const UserSignUp = require("../model/userSignup");
const addClient = require("../model/addClient");
const { validateSignUpData } = require("../utilis/validation")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");


const authRoute = express.Router();

//Route for fetching clients
authRoute.get("/clients", async (req, res) => {
  try {
    const clients = await addClient.find({});
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching clients data", error });
  }
});

//Route for fetching client by id
authRoute.get("/clients/:id", async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await addClient.findById(clientId);
    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching client data", error });
  }
});

//Route for updating client status
authRoute.put("/clients/:id", async (req, res) => {
  try {
    const clientId = req.params.id;
    const updatedData = req.body;

    const updatedClient = await addClient.findByIdAndUpdate(clientId, updatedData, { new: true });
    if (!updatedClient) {
      return res.status(404).send({ message: "Client not found" });
    }
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error updating client status", error });
  }
});

//Route for adding client
authRoute.post("/addClient", async (req, res) => {
  try {
    const client = req.body;
    console.log(client);

    const newClient = new addClient(client);
    await newClient.save();
    res.status(200).send({ message: "Client added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding client", error });
  }
});

//Route for adding packages
authRoute.post("/addPackages", async (req, res) => {
  try {
    const packages = req.body;
    console.log(packages);

    await Package.insertMany(packages);
    res.status(200).send({ message: "Packages added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error adding packages", error });
  }
});

//Route for fetching packages
authRoute.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find({});
    res.status(200).json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching packages data", error });
  }
});

//Route for signing up
authRoute.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, gender, place, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
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
    res.cookie("token", token);
    res.json({ message: "user added successfully", data: savedUser });
  } catch (error) {
    console.error(error);
    res.status(400).send("send the error message" + error.message);
  }
});

//Route for login
authRoute.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const userLogin = await UserSignUp.findOne({ emailId: emailId });
    if (!userLogin) {
      throw new Error("Email Id is not correct");
    }
    const isPasswordValid = await userLogin.validatePassword(password);
    if (isPasswordValid) {
      const token = await userLogin.getJWT();
      res.cookie("token", token);
      res.send(userLogin);
    } else {
      throw new Error("Password is not correct");
    }
  } catch (error) {
    res.status(400).send("Error sending the user, " + error.message);
  }
});

//Route for checking authentication
authRoute.get("/checkAuth", authMiddleware, (req, res) => {
  res.json({ isLoggedIn: true, user: req.user });
});

//Route for logout
authRoute.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  }).send("logout successfully !!!")
})

module.exports = authRoute;
