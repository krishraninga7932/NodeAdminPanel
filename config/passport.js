
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../model/Admin');

passport.use(new LocalStrategy(
    {
        usernameField : 'email'
    },
    async function(username, password, done) {
        try{
            let adminRecord = await Admin.findOne({email : username});
            if(!adminRecord || adminRecord.password !== password){
                console.log("Invalid Username Password");
                return done(null, false)              
            }
            return done(null, adminRecord);
        }
        catch(err){
            console.log("Error to Find User Detail");
            return done(err);
        }
    }
)) 

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser( async function(id, done) {
    try{
        let user = await Admin.findById(id);
        if(!user){
            return done(null, false) ;
        }
        return done(null, user);
    }
    catch(err){
        console.log("Error to Find User Detail");
        return done(err);
    }
});

passport.checkAuthentication = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;
