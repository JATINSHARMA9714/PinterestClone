var express = require('express');
var router = express.Router();
const passport = require("passport")
const userModel = require("./users")
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */

// for view
router.get('/', function(req, res, next) {
  res.render('index');
});




// for view
router.get('/feed', function(req, res, next) {
  res.render('feed');
});




// for view
router.get('/login', function(req, res, next) {
  res.render('login');
});


//profile
router.get("/profile",isLoggedIn,function(req,res){
  res.render("profile");
})


//register
router.post("/register",function(req,res){
  var userdata = new userModel({
    username:req.body.username,
    email:req.body.email,
    fullName:req.body.fullName
  });

  userModel.register(userdata,req.body.password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile')
    })
  })
});

//login
router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login"
}),function(req,res){})


//logout
router.get("/logout",function(req,res,next){
  req.logout(function(err){
    if(err){return next(err);}
    res.redirect("/");
  });
});


//loginMiddleware
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}






module.exports = router;
