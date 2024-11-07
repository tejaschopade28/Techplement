const path = require("path");
const express= require("express");

const mongoose = require('mongoose')
const cookieParser=require("cookie-parser");
const userRoutes= require('./router/user');

const { checkForAuthenticationCookies } = require("./middleware/authentication");

const app = express();
const PORT= 8002;


mongoose.connect('mongodb://127.0.0.1:27017/techplement').
then((e)=>console.log('Mongodb connnected'));


app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve("./public")))
app.use(express.static('public'));
app.use(cookieParser()); 
app.use(checkForAuthenticationCookies("token")); 

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.get('/', async(req,res)=>{
    res.render('home');
})


app.use('/user', userRoutes);

app.listen( PORT,()=> console.log(`server started at ${PORT}`));