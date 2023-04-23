const Company = require('../models/company');
const Student = require('../models/student');
const Job = require('../models/job');


// render the home page with student and company details only if they logged in, else render login page
module.exports.home = async function (req, res) {
	try {
		return res.render('home', {
			title : `Sachin's App`,  
		});
	}catch(err){
		console.log(`Error occured on HomeController ${err}`);
	}
};

// function for sending informations jobs for specific company, its called by userHome function 
async function returnCompany(company){

	let returnCompany = []

	for ( oneCompany of company ) {

		NewOneCompany = oneCompany;
		var JobList = []

		if (oneCompany.jobs && oneCompany.jobs.length) {
			for ( c of oneCompany.jobs ) {
				let jj = await Job .findById(c)
					.then( (job) => {

						let newObject = { position : job.position, CTC : job.CTC, ID : job.id }
						return newObject; 

					}) .catch( (err) => { console.log(`Error during pushing a job in companys`); })
				
				JobList.push(jj);
				NewOneCompany.jobsList = JobList; 
			
			}

			let val = {
				Company : NewOneCompany,
				cc : NewOneCompany.jobsList,
			}

			await returnCompany.push(val);
		
		}
		else {
			let val = {
				Company : NewOneCompany, 
				cc : []
			}
			await returnCompany.push(val);
		}
	}
	// console.log("******************\n", returnCompany, "\n******************");
	return returnCompany;

}

// userHome is the function to render home page only the user is logged in
module.exports.userHome = async function (req, res) {
	try {
		// console.log("Check IT :: \n ", students);
		let students = await Student.find(); // let emailID = res.locals.user.email; // for ( loop of reviewlist.reviewlist ) { }
		let companys = await Company.find()
						.then( (company) => {
							return returnCompany(company) ;						
						});
		

		return res.render('home', {
			title : `Sachin's App`,  
			studentList : students,
			companyList : companys
		});
	}catch(err){
		console.log(`Error occured on HomeController ${err}`);
	}
};
