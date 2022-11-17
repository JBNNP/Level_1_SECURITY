//jshint esversion:6
require('dotenv').config();
const md5 = require("md5");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const secret = process.env.SECRET;

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"], decryptPostSave: false });

const User = new mongoose.model("User", userSchema); //ALWAYS PUT THIS AFTER SETTING UP A ENCRYPTION

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/secrets", (req, res) => {
    res.render("secrets");
});

app.get("/submit", (req, res) => {
    res.render("submit");
});

app.post("/register", (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
           });
        console.log(hash);

        newUser.save((err) => {
            err ? console.log(err) : res.render("secrets");
           });
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                } else {
                    res.send("Wrong pass or email");
                }
            } else {
                res.send("did not find that user");
            }
        }
        console.log(foundUser.password);
    })
});



app.listen(3000, ()=>{
    console.log("Server is connected");
});