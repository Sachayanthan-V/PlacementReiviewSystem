const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({

    position : {
        type : String,
        required : true
    },
    selectedStudents : {
        type : [], 
        required : true
    },
    CTC : {
        type : String,
        required : true
    },
    companyName : {
        type : String, 
        required : true
    }

}, {
    timestamps : true 
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;