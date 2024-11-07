
const path = require("path");
const {Router}= require('express');
const User= require("../models/user");

const jwt= require('jsonwebtoken');

const multer = require('multer');

const router= Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/images/`));
    },
    filename: function (req, file, cb) {
      const filename =  `${Date.now()}-${file.originalname}`;
      cb(null, filename);
    },
  });

const upload = multer({ storage: storage });

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/signin", (req, res) => {
  return res.render("signin");
});


router.post("/signin", async (req, res) => {
  const { email,password } = req.body;
try{
    const token = await User.matchingPasswordGenerateToken(email, password);
    // console.log(token);
    return res.cookie("token", token).redirect("/",);
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});


router.post("/signup",upload.single("ProfileImage"), async (req, res) => {
  // console.log(req.body);
  const { fullname, email, password } = req.body;
  
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("signup", {
        error: "Email already in use. Please choose another email.",
      });
    }
  await User.create({
    fullname,
    email,
    password,
    ProfileImage: `/images/${req.file.filename}`
  });
  return res.redirect("/",);
}catch(error){
  console.log("Error during the signup:", error);
  return res.render('signup',{
    error:"Am error occur during signup,",
  });
  }
});

  module.exports = router;
