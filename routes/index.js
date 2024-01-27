var express = require('express');
var router = express.Router();
const passport = require("passport")
const userModel = require("./users")
const postModel = require("./posts")
const upload = require('./multer')
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


/* GET home page. */

// for view
router.get('/', function(req, res, next) {
  res.render('index');
});




// for view
router.get("/feed",async (req,res)=>{
  let allPost = await postModel.find();
  res.render("feed",{posts:allPost})
})




// for view
router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash("error")});
});


//profile
router.get("/profile",isLoggedIn,async function(req,res){
  // automatically details get saved to session .passport
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts')
  res.render("profile",{user:user});
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
  failureRedirect:"/login",
  failureFlash:true
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


//image upload
router.post("/upload",isLoggedIn,upload.single('file'),async (req,res)=>{
  if(!req.file){
    return res.status(404).send("No file uploaded")
  }

  // save uploaded file as a post
  let user = await userModel.findOne({username: req.session.passport.user});
  let postdata = await postModel.create({
    postText: req.body.description,
    postImage:req.file.filename,
    user:user._id,
   })
  user.posts.push(postdata._id);
  await user.save();
  res.redirect("/profile")
});

//update profilePhoto
router.post("/uploadPhoto",isLoggedIn,upload.single('image'),async (req,res)=>{
  if(!req.file){
    return res.status(404).send("No file uploaded")
  }

  // save uploaded file as a dp
  let user = await userModel.findOne({username: req.session.passport.user});
  user.dp = req.file.filename;
  await user.save();
  res.redirect("/profile")
})





module.exports = router;
