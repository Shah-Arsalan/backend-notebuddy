const express = require('express')
const { extend } = require('lodash')
const cors = require('cors')
const router = express.Router()
const user = require('../models/users.models')
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
var jwt = require('jsonwebtoken');


const secret = process.env.AUTH_SECRET;

router.route('/signup')
  .post(async (req, res) => {
    try {
      const { email, firstname, lastname, password } = req.body;
      console.log("email", email);
      const newUser = new user({ email, firstname, lastname, password })
      await newUser.save()
        .then((savedUser) => {
          console.log("going forward")
          res.status(201).json({ success: true, message: "User Created" })
        })
        .catch((err) => {
          console.log(err.code)
          console.log(err.code == 11000)
          if (err.code == 11000) {
            res.status(422).json({ success: false, message: "User already exists" })
            return;
          } else {
            res.status(500).json({ success: false, message: "Internal Server Error" })
            return;
          }
        })
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" })

    }

  })



router.route('/login')
  .post(async (req, res) => {
    try {
      console.log("coming here")
      const { email, password } = req.body;
      console.log("email , password", email, password)
      const foundUser = await user.find({ email: email })
      if (foundUser.length !== 0) {
        console.log("The found user is", foundUser)
        console.log("founduser.password", foundUser[0].password)
        console.log("the email of founduser is", foundUser[0].email)
        if (password === foundUser[0].password) {
          const token = jwt.sign({
            userId: foundUser[0].email
          }, secret, { expiresIn: '1h' });
          res.status(201).json({ email, token })
        }
        else {
          res.status(401).json({ message: "password entered is wrong" })
        }
      } else {
        res.status(404).json({ message: "email entered not found" })
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal Server Error" })

    }

  })

module.exports = router;