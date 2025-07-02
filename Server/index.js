 const express = require('express');
 const mongoose = require('mongoose');
 const cors = require('cors');

 const app = express();
 app.use(cors());
 app.use(express.json());

 mongoose.connect('mongodb+srv://saravana:Saravana1634@cluster0.gnbrisd.mongodb.net/')
 app.post('/add', (req, res) => {
   const task = req.body.task;
 })
 app.listen(3000, ()=> {
    console.log("server is running")
 })