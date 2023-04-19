const Student = require('./../models/student');
const Job = require('../models/job');
const company = require('./../models/company');
const Company = require('./../models/company');


function DummyStudent () {

    let ds = [
            {name : "sachin",  email : "sachin@gmail.com", dob : "1999-01-20", batch : "2023-04-15", qualification : "BE" , collegeName : "REC" , degree : "robotics" , placed : "On Campus" , CGPA : "9" },
            {name : "sri",  email : "sri@gmail.com", dob : "2002-03-11", batch : "2023-04-15", qualification : "BTECH" , collegeName : "REC" , degree : "robotics" , placed : "On Campus" , CGPA : "10" },
            {name : "pooja",  email : "pooja@gmail.com", dob : "2007-08-17", batch : "2023-04-15", qualification : "BE" , collegeName : "REC" , degree : "robotics" , placed : "On Campus" , CGPA : "8" },
            {name : "dummy1",  email : "dummy1@gmail.com", dob : "1999-01-20", batch : "2023-04-15", qualification : "BE" , collegeName : "REC" , degree : "robotics" , placed : "On Campus" , CGPA : "6" },
            {name : "dummy2",  email : "dummy2@gmail.com", dob : "1999-01-20", batch : "2023-04-15", qualification : "BE" , collegeName : "REC" , degree : "robotics" , placed : "On Campus" , CGPA : "5" }
            ]

    return ds;

}

function DummyCompany () {

    let dc = [
                {company : "WHO", jobs : [ ] },
                {company : "CAN", jobs : [ ] },
                {company : "BUY", jobs : [ ] },
                {company : "NOTHING", jobs : [ ] },
                {company : "ABC", jobs : [ ] },
                {company : "AIR", jobs : [ ] },
                {company : "FAN", jobs : [ ] },
             ]
            
    return dc;

}


module.exports.addStudent = async function(req, res) {

    let dummyStudent = DummyStudent();

    for ( ds of dummyStudent ) {

        let studentDetails = {
            qualification : ds.qualification,
            collegeName   : ds.collegeName  ,
            degree        : ds.degree       ,
            placed        : ds.placed       ,
            CGPA          : ds.CGPA         
        }
        let courseScores = {
            DSA : 0,
            WebDev : 0,
            React : 0
        }
        let StudentData = {
            name  : ds.name  ,
            email : ds.email ,
            dob   : ds.dob   ,
            batch : ds.batch ,
            studentDetails : studentDetails, 
            courseScores : courseScores
        }

        await Student.findOne({ email : ds.email })
                    .then((student)=>{
                        
                        if(student){
                            console.log(`Student is already exists create with different Email Id`); 
                            
                        }
                        
                        if (!student){

                            Student.create(StudentData)
                                    .then( (newStudent) => {
                                        console.log(`New Student added :: \n ${newStudent}`);
                                        
                                    })
                                    .catch( (studentErr) => {
                                        console.log(`Error occurred while creating a new student :: \n ${studentErr}`);
                                        
                                    })
                        
                        }

                    })
                    .catch((err)=>{ console.log(`Error occured while finding Student`);  })

    }

    return res.redirect('back');
    
}

module.exports.addCompany = async function(req, res){

    let dummyCompany = DummyCompany();

    for ( DC of dummyCompany ) {

        let companyName = DC.company ;
        let create = {
            name : DC.company, 
            jobs : DC.jobs
        }

        Company.findOne({name : companyName})
            .then((oldCompany)=>{
                if(oldCompany){
                    console.log(`Company already registered in this website`);
                    // return res.redirect('back');
                }

                if(!oldCompany){
                    Company.create( create )
                           .then((newCompany)=>{
                                console.log(`New Company is registered :: \n ${newCompany}`);
                                // return res.redirect('back');
                           })
                           .catch((err)=>{
                                console.log(`Error while during creating a new Company :: \n ${err}`);
                                // return res.redirect('back');
                           })
                }

            })
            .catch((err)=>{
                console.log(`Error during searching company in DB :: \n ${err}`);
                // return res.redirect('back');
            })

    }

    return res.redirect('back');

}