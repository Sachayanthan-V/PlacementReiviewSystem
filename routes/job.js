const express = require('express');
const router = express.Router();
const passport = require('passport');
const JobController = require('../controllers/company_job_controller');
const HomeController = require('../controllers/home_controller');


router.get('/jobform/:id'    , passport.checkAuthentication, JobController.jobForm );
router.post('/createJob/:id' , passport.checkAuthentication, JobController.createJob );
router.post('/Delete/:id' , passport.checkAuthentication, JobController.DeleteJob );
router.post('/deleteCompany/:id' , passport.checkAuthentication, JobController.DeleteCompany );
router.post('/createCompany/' , passport.checkAuthentication, JobController.CreateCompany );
router.post('/Assign/:id' , passport.checkAuthentication, JobController.AssignJobForm );
router.get('/Assign/*' , passport.checkAuthentication, HomeController.userHome );
router.get('/acceptJob/:id&:email', passport.checkAuthentication, JobController.acceptJob );
router.get('/declineJob/:id&:email', passport.checkAuthentication, JobController.declineJob );


module.exports = router;