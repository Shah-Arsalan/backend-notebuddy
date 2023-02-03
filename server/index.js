const express = require('express');
var mongo = require('mongodb')
const { MongoClient } = require('mongodb')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Schema } = mongoose;
const connectionFunc = require('./database/database.connect')
const cors = require('cors')
const userroute = require('./routes/users.router')
const notesroute = require('./routes/notes.router')
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 5000;
console.log("the corssss is ", cors)
connectionFunc();

const secret = process.env.AUTH_SECRET;
const url = process.env.CONNECTION_URL;
console.log("The sec is ", secret)
console.log("The url is ", url)



app.get('/', (req, res, next) => {
  res.json('Hello Express app!')
  next();
});


app.use("/users", userroute)
app.use("/notes", notesroute)




app.listen(PORT, () => {
  console.log('server started');
});

//process.env.API_KEY