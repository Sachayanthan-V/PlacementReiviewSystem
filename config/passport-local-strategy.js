const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('./../models/user');

// authentication using passport
passport.use( new LocalStrategy({
        usernameField : 'email'
    },
    function(email, password, done) {
        // find a user and establish the identity
        User.findOne({email : email}).then((user)=>{
            if(!user || user.password != password) {  
                console.log('Invalid userName/ password'); 
                return done(null, false);
            }
            return done(null, user);
        })
        .catch((err)=>{
            console.log(`Error in finding user -> passport`);
            return done(err);
        });
    }
));


// serializing the user to decide which key is to be keep in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


// deserializing the suer from the key in the cookies

passport.deserializeUser( function(id, done){
    User.findById(id ).then((user)=>{
        return done(null, user);
    }).catch((err)=>{
        console.log(`Error in finding user DS -> passport`);
        return done(err);
    });
});


// check if the user is authenticated 
passport.checkAuthentication = function(req, res, next) {
    // if the user is signed in, then pass on the request to the next function( controller's action)
    if(req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;