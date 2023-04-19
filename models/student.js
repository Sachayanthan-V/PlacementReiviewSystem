const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema ({

    name  : { type : String, required : true },
    email : { type : String, required : true },
    dob   : { type : String, required : true },
    batch : { type : String, required : true },
    
    studentDetails : { 
        type : {
            qualification : { type : String, required : true } ,
            collegeName   : { type : String, required : true } ,
            degree        : { type : String, required : true } ,
            placed        : { type : String, required : true } ,
            CGPA          : { type : String, required : true } 
        },
        required : true
    },
    
    courseScores : { 
        type : {
            DSA    : { type : Number , required : true  } ,
            WebDev : { type : Number , required : true  } ,
            React  : { type : Number , required : true  }
        },
        required : true
    },
    
    Interviews : { type : [] }, // [ [jobID, DateOfInterview], etc., ]
    Results    : { type : [] }, // [ [ jobID, "passed" ] , etc., ]

    
}, { timestamps : true  });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;