const passport = require('passport');
const User = require('../models/user');
const Student = require('../models/student');

// function for user sign up ::

module.exports.signUp = function(req, res) {

    if(req.isAuthenticated()){
        return res.redirect('/users');
    }

    return res.render('user_sign_up', {
        title : "codial sign up"
    });

}

// function for user sign in ::

module.exports.signIn = function(req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/users');
    }
    
    return res.render('user_sign_in', {
        title : "codial sign in"
    });
}

// create a new user if they register ::

module.exports.create = function(req, res) { 

    // if both password not match return to same page to do it again.
    if ( req.body.password != req.body.confirm_password ) {
        req.flash('success', 'password doesnt match');
        return res.redirect('back');  
    }

    User.findOne( {email : req.body.email} ) 
        .then((user)=>{

            if (!user) {

                User.create( req.body )

                    .then((newuser)=>{  
                        req.flash('success', 'Account Created Successfully!...');
                        return res.redirect('/users/sign-in');
                    })
                    .catch((err)=>{

                        if(err){console.log(`Error while creating a user during signing up`); return; }
                    })
                
            }
            if (user) {
                
                req.flash('success', 'User Name is already Exists');
                return res.redirect('back');
            }

        })
        .catch((err)=>{
            if(err){console.log(`Error while finding a user during signing up`); return; }
        })

}

// create an session for the user who is loggin in :: 

module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/users');
}


// destroying session while user trying to logout ::

module.exports.destroySession = function(req, res) {
    req.flash('success', 'Logged out successfully');
    req.logout( function(err){ console.log('Logout Error : ', err) } );
    // req.session.destroy();
    return res.redirect('/');
}

