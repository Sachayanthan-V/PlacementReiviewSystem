const express = require('express');
const router = express.Router();
const passport = require('passport');
const StudentController = require('../controllers/student_controller');

router.post('/updateDsaScore/:id'   , passport.checkAuthentication  , StudentController.DSAScore   );
router.post('/updateWebScore/:id'   , passport.checkAuthentication  , StudentController.WebScore   );
router.post('/updateReactScore/:id' , passport.checkAuthentication  , StudentController.ReactScore );
router.get('/profile/:id'           , passport.checkAuthentication  , StudentController.studentProfile );
router.post('/assignInterview/:id', passport.checkAuthentication, StudentController.AssignJob );
router.get('/deleteStudent/:id', passport.checkAuthentication, StudentController.DeleteStudent ); 

module.exports = router;