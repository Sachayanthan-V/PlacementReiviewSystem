const mongoose = require('mongoose');

const companySchema = mongoose.Schema({

    name : {
        type : String, 
        required : true
    },
    jobs : {
        type : [],
        required : true
    }

}, {
    timestamps : true 
});


const Company = mongoose.model('Company', companySchema);

module.exports = Company;