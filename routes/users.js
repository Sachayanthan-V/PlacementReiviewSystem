const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/user_controller');
const homeController = require('./../controllers/home_controller');
const StudentController = require('./../controllers/student_controller');
const CompanyController = require('./../controllers/company_job_controller');


router.get('/', homeController.userHome );
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create);
router.get('/sign-out', usersController.destroySession); 
router.get('/student', passport.checkAuthentication, StudentController.studentForm );
router.get('/registerCompany', passport.checkAuthentication, CompanyController.RegisterCompany );
router.post('/addStudent', passport.checkAuthentication, StudentController.addStudent );

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate( 'local', {failureRedirect : '/users/sign-in'} ) , 
    usersController.createSession
);

module.exports = router;