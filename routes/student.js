const express = require('express');
const router = express.Router();
const passport = require('passport');
const StudentController = require('../controllers/student_controller');
const dummyStudentCreatorController = require('./../controllers/dummydata_controller');

router.post('/updateDsaScore/:id'   , passport.checkAuthentication  , StudentController.DSAScore   );
router.post('/updateWebScore/:id'   , passport.checkAuthentication  , StudentController.WebScore   );
router.post('/updateReactScore/:id' , passport.checkAuthentication  , StudentController.ReactScore );
router.get('/profile/:id'           , passport.checkAuthentication  , StudentController.studentProfile );
router.get('/createdummy', passport.checkAuthentication, dummyStudentCreatorController.addStudent );
router.get('/createCompany', passport.checkAuthentication, dummyStudentCreatorController.addCompany );
router.post('/assignInterview/:id', passport.checkAuthentication, StudentController.AssignJob );

module.exports = router;