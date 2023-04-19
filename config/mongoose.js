const mongoose = require('mongoose');

// mongoose.connect('mongodb+srv://sachayanthanv1999:JxeAWchTq21VaerQ@cluster0.ajh9ftk.mongodb.net/?retryWrites=true&w=majority'); // db url with authentication 
mongoose.connect('mongodb://127.0.0.1:27017/placementCell');

const db = mongoose.connection; // establishing a sever

db.on('error', (err)=>{console.log(`Error occured while connecting to DB ::  mongodb \n Error : ${err}`)}); // incase any error due to server or user

db.once('open', ()=>{console.log(`Successfully connected to the database :: mongodb`)}); // successfull established connection

module.exports = db; // check this out.