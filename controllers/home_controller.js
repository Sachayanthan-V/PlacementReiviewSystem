const Company = require('../models/company');
const Student = require('../models/student');
const User = require('../models/user');
const Job = require('../models/job');

module.exports.home = async function (req, res) {
	try {
		return res.render('home', {
			title : `Sachin's App`,  
		});
	}catch(err){
		console.log(`Error occured on HomeController ${err}`);
	}
};

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
