const Student = require('../models/student');
const Company = require('../models/company');
const Job     = require('../models/job');

module.exports.createJob = async function(req, res) {

    let newjob = {
                    position : req.body.position,
                    selectedStudents : [],
                    CTC : req.body.CTC
                }

    await Job.create(newjob)
            .then( (newJob) => {
                console.log(`New Job created :: \n ${newJob}`);

                let companyID = req.params.id ;
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

module.exports.jobForm = async function(req, res) {

    return res.render('post_job', {
        title : "Job Form",
        companyID : req.params.id
    });

}

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

module.exports.RegisterCompany = async function(req, res) {

    return res.render('post_company', {
        title : "Register Company"
    });

}

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
                    console.log(`Error while collecting students list ::: \n${err}`);
                    return res.redirect('back');
                 });

}