const Student = require('./../models/student');
const Job     = require('./../models/job');


module.exports.studentForm = async function(req, res) {
    return res.render('add_employee.ejs', {
        title : "Student Form"
    });
}

module.exports.addStudent = async function(req, res) {

    let studentDetails = {
        qualification : req.body.qualification,
        collegeName   : req.body.collegeName  ,
        degree        : req.body.degree       ,
        placed        : req.body.placed       ,
        CGPA          : req.body.cgpa         
    }

    let courseScores = {
        DSA : 0,
        WebDev : 0,
        React : 0
    }

    let StudentData = {
        name  : req.body.name  ,
        email : req.body.email ,
        dob   : req.body.dob   ,
        batch : req.body.batch ,
        studentDetails : studentDetails, 
        courseScores : courseScores
    }


    await Student.findOne({ email : req.body.email })
            .then((student)=>{
                
                if(student){
                    console.log(`Student is already exists create with different Email Id`); 
                    return res.redirect('back');
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
            .catch((err)=>{ console.log(`Error occured while finding Student`); })


    return res.redirect('back');
}

module.exports.studentProfile = async function(req, res) {

    let userEmail = req.params.id;
    console.log(userEmail);

    await Student.findOne({email : userEmail})
            .then( (user) => {
                return res.render('profile', {
                    title : 'profile page',
                    student : user
                })
            })
            .catch((err)=> {
                console.log(`Error during profile for the USER ${userEmail} :: \n ${err}`);
                return res.redirect('back');
            });

}

module.exports.DSAScore = async function(req, res) {

    let score = req.body.uScore;

    await Student.findById(req.params.id)
                 .then((oldStudent)=>{
                    
                    let web =  oldStudent.courseScores.WebDev;
                    let react =  oldStudent.courseScores.React;

                    Student.findByIdAndUpdate(req.params.id, {courseScores : {DSA : score, WebDev : web, React: react}})
                                .then( (student) => {
                                    console.log(`update DSA :: \n ${student}`);
                                    return res.redirect('back');
                                })
                                .catch( (err) => {
                                    console.log(`Error during updating a DSA score ${err}`);
                                    return res.redirect('back');
                                })
                    })
                    .catch( (oldStudentErr)=>{
                        console.log(`OLD STudent Error :: \n ${oldStudentErr}`);
                        return res.redirect('back');
                    } )

}

module.exports.WebScore = async function(req, res) {
    let score = req.body.uScore;

    await Student.findById(req.params.id)
                 .then((oldStudent)=>{
                    
                    let dsa =  oldStudent.courseScores.DSA;
                    let react =  oldStudent.courseScores.React;

                    Student.findByIdAndUpdate(req.params.id, {courseScores : {DSA : dsa, WebDev : score, React : react}})
                            .then( (student) => {
                            console.log(`update DSA :: \n ${student}`);
                            return res.redirect('back');
                            })
                            .catch( (err) => {
                            console.log(`Error during updating a DSA score ${err}`);
                            return res.redirect('back');
                            })
                 })
                 .catch( (oldStudentErr)=>{
                     console.log(`OLD STudent Error :: \n ${oldStudentErr}`);
                    return res.redirect('back');
                 } )

        
}

module.exports.ReactScore = async function(req, res) {
    let score = req.body.uScore;

    await Student.findById(req.params.id)
                 .then((oldStudent)=>{
                    
                    let dsa =  oldStudent.courseScores.DSA;
                    let web =  oldStudent.courseScores.WebDev;
                
                    Student.findByIdAndUpdate(req.params.id, {courseScores : {DSA : dsa, WebDev : web , React : score}})
                            .then( (student) => {
                                console.log(`update DSA :: \n ${student}`);
                                return res.redirect('back');
                            })
                            .catch( (err) => {
                                console.log(`Error during updating a DSA score ${err}`);
                                return res.redirect('back');
                            })

                })
                .catch( (oldStudentErr)=>{
                    console.log(`OLD STudent Error :: \n ${oldStudentErr}`);
                    return res.redirect('back');
                })

}

module.exports.AssignJob = async function(req, res) {

    console.log(`Entered to the Assign job`);
    console.log(`PARAMS :: ${req.params.id} `);
    console.log(`studentID :: ${req.body.studentID} `);
    let jobID = req.params.id;
    let studentID = req.body.studentID;

    await Job.findById(jobID)
             .then((thisjob)=>{

                let array = thisjob.selectedStudents;
                array.push(studentID);

                Job.findByIdAndUpdate(jobID, {selectedStudents : array})
                    .then((updatedJob)=>{
                        console.log(`Job Updated successfully `);

                        Student.findById(studentID)
                                .then((stu)=>{
                                    
                                    let array = stu.Interviews;
                                    array.push(jobID);

                                    Student.findByIdAndUpdate(studentID, {Interviews : array})
                                            .then((updatedStudent)=>{
                                                console.log(`Student Interview list is added successfully!...`);
                                                return res.redirect('../../users');
                                            })
                                            .catch((err)=>{
                                                console.log(`Error during updating a interview list in student ::\n ${err}`);
                                                return res.redirect('../../users');
                                            });
                                })
                                .catch((err)=>{
                                    console.log(`Error during updating a interview list in student ::\n ${err}`);
                                    return res.redirect('../../users');
                                });

                    })
                    .catch((err)=>{
                        console.log(`Error during updating a selectedArray in job ::\n${err}`);
                        return res.redirect('../../users');
                    })

            })
            .catch((err)=>{
                console.log(`Error during finding a job in Interview ::\n ${err}`);
                return res.redirect('../../users');
            });

}
