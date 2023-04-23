const Student = require('../models/student');
const Company = require('../models/company');
const Job     = require('../models/job');


// create a job in job models, and add the jobid, into respective company
module.exports.createJob = async function(req, res) {

    

    let companyID = req.params.id ;
    
    let companyName = await Company.findById(companyID).then((c)=>{ return c.name })

    let newjob = {
        position : req.body.position,
        selectedStudents : [],
        CTC : req.body.CTC, 
        companyName : companyName
    }

    await Job.create(newjob)
            .then( (newJob) => {
                console.log(`New Job created :: \n ${newJob}`);
                
                console.log("Company ID :: => ::",companyID);

                Company.findByIdAndUpdate(companyID, { $push: { jobs : newJob.id } })
                        .then( (jobC) => {
                            console.log(`Company is updated by the new job :: ${jobC}`);
                            return res.redirect('../../users');
                        })
                        .catch( (err) => {
                            console.log(`Error during appending a job in company :: \n ${err}`);
                            return res.redirect('back');
                        })

            })
            .catch( (err)=>{
                console.log(`Error during creating a Job :: \n ${err}`);
                return res.redirect('back');
            });

}

// forward/render to jobform page
module.exports.jobForm = async function(req, res) {

    return res.render('post_job', {
        title : "Job Form",
        companyID : req.params.id
    });

}

// delete a job as well as deleting a job under the company which is holding that job
module.exports.DeleteJob = async function(req, res) {

    console.log(`Entered in DeleteJob`)

    await Job.findByIdAndDelete(req.params.id)
             .then((deleteItem)=>{

                console.log(`Deleted Job Successfully!...`);
                Company.findById(req.body.companyID)
                .then( (thisCompany)=>{
                    let Array  = thisCompany.jobs;
                    let Array2 = Array.remove(req.body.jobID); 
    
                    Company.findByIdAndUpdate(req.body.companyID, {jobs : Array})
                            .then((NewCompany)=>{ console.log(`updated Company Successfully!...`); return res.redirect('back'); })
                            .catch((err)=>{ console.log(`Error updating Company :: \n ${err} !...`); return res.redirect('back'); })

                });
            })
            .catch((err)=>{
                console.log(`Error while deleting a Job!...`);
                return res.redirect('back');
            });

}

// deleting a company from DB
module.exports.DeleteCompany = async function(req, res) {
    console.log(`Entered Delete company === ${req.params.id} `);

    await Company.findById(req.params.id)
                 .then((thisCompany)=>{

                    let Array = thisCompany.jobs;
                    for ( job of Array ) {
                        
                        Job.findByIdAndDelete(job)
                            .then((deleteItem)=>{
                                console.log("Only this job Deleted");
                            })
                            .catch((err)=>{
                                console.log(`Error while deleting a Job!...`);
                            });
                    }

                 }).catch((err)=>{
                    console.log(`Error during deleting multiple jobs while deleting a company :: \n ${err}`);
                 });

    await Company.findByIdAndDelete(req.params.id)
                 .then((dc)=>{ console.log(`Company Deleted Successfully`); return res.redirect('back'); })
                 .catch((err)=>{ console.log(`Error during Deleting a company :: \n ${err}`); return res.redirect('back'); })

}

// create a company with requirements
module.exports.CreateCompany = async function(req, res) {
    
    let companyName = req.body.name ;
    let create = {
        name : req.body.name, 
        jobs : []
    }

    Company.findOne({name : companyName})
        .then((oldCompany)=>{
            if(oldCompany){
                console.log(`Company already registered in this website`);
                return res.redirect('back');
            }

            if(!oldCompany){
                Company.create( create )
                        .then((newCompany)=>{
                            console.log(`New Company is registered :: \n ${newCompany}`);
                            return res.redirect('back');
                        })
                        .catch((err)=>{
                            console.log(`Error while during creating a new Company :: \n ${err}`);
                            return res.redirect('back');
                        })
            }

        })
        .catch((err)=>{
            console.log(`Error during searching company in DB :: \n ${err}`);
            return res.redirect('back');
        })

}

// forward/render to register form for company
module.exports.RegisterCompany = async function(req, res) {

    return res.render('post_company', {
        title : "Register Company"
    });

}

// forward/render to form for student assign to job 
module.exports.AssignJobForm = async function(req, res) {

    await Student.find({})
                 .then( (studentList)=>{
                    return res.render('assign_interview', {
                        title : "Assign Student for job", 
                        jobID : req.params.id, 
                        StudentList : studentList
                    })
                 })
                 .catch((err)=>{
                    // console.log(`Error while collecting students list ::: \n${err}`);
                    return res.redirect('back');
                 });

}

// Student when accepted the job and he must be selected by the interview, 
// and results will show the job is selected for the particular student
module.exports.acceptJob = async function(req, res) {

    let jobID = req.params.id;
    let email = req.params.email;
    let studentName = '';
    let studentDetails;
    let jobDetails;
    let resultList = [];
    let StudentID ;

    await Student.find({email : email})
                 .then((user)=>{

                    user = user[0];

                    StudentID = user._id;
                    studentName = user.name;
 
                    studentDetails = {
                        name  : studentName,
                        ID    : StudentID,
                        email : email,
                    }
                    
                    if(user.Results){
                        resultList = user.Results;
                    }
                    resultList.push(jobID);

                    let InterviewList = user.Interviews;
                    InterviewList.remove(jobID);

                    Student.findOneAndUpdate({email : email}, { Interviews : InterviewList})
                            .then((updatedUser)=>{ console.log(`Updated User :: ${updatedUser}`); })
                            .catch((error)=>{ console.log(`Error during updating student by result`); });

                 });

    await Job.findById(jobID)
                .then((job)=>{
                    let selectedStudents = []
                    jobDetails = {
                        companyName : job.companyName ,
                        position : job.position,
                        CTC : job.CTC,
                        Status : "SELECTED"
                    }
                    if(job.selectedStudents) {
                        selectedStudents = job.selectedStudents;
                    }
                    selectedStudents.push(studentDetails);
                    Job.findByIdAndUpdate(jobID, {selectedStudents : selectedStudents})
                        .then( (updatedJob) => { /*console.log(`Updated job :: \n ${updatedJob}`);*/ })
                        .catch( (err) => { console.log(`Updating job with selected students Error :: \n ${err}`); } )
                });

    await Student.findById(StudentID)
                 .then((currentStudent)=>{
                    let results = []
                    if(currentStudent.Results){
                        results = currentStudent.Results;
                    }
                    console.log(results);
                    results.push(jobDetails);
                    console.log(results);
                    Student.findByIdAndUpdate(StudentID, { Results : results })
                           .then((studentResults)=>{
                                console.log(studentResults);
                           })
                           .catch((err)=>{
                                console.log(err);
                           })
                })

    return await res.redirect('back');

}

// Student when declined the job and he must be rejected by the interview, 
// and results will show the job is Rejected for the particular student
module.exports.declineJob = async function(req, res) {
    
    let jobID = req.params.id;
    let email = req.params.email;
    let jobDetails;
    let resultList = [];
    let StudentID ;

    await Student.find({email : email})
                 .then((user)=>{

                    user = user[0];
                    StudentID = user._id;

                    if(user.Results){
                        resultList = user.Results;
                    }
                    resultList.push(jobID);

                    let InterviewList = user.Interviews;
                    InterviewList.remove(jobID);

                    Student.findByIdAndUpdate( StudentID , { Interviews : InterviewList})
                            .then((updatedUser)=>{ console.log(`Updated User :: ${updatedUser}`); })
                            .catch((error)=>{ console.log(`Error during updating student by result`); });

                 });

    await Job.findById(jobID)
                .then((job)=>{
                    jobDetails = {
                        companyName : job.companyName ,
                        position : job.position,
                        CTC : job.CTC,
                        Status : "REJECTED"
                    }
                });

    await Student.findById(StudentID)
                 .then((currentStudent)=>{
                    let results = []
                    if(currentStudent.Results){
                        results = currentStudent.Results;
                    }
                    console.log(results);
                    results.push(jobDetails);
                    console.log(results);
                    Student.findByIdAndUpdate(StudentID, { Results : results })
                           .then((studentResults)=> { console.log(studentResults); })
                           .catch((err)=>{ console.log(err); })
                })

    return await res.redirect('back');

}
