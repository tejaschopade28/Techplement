
const mongoose= require('mongoose');
const {createHmac, randomBytes}= require('crypto');

const { createTokenForUser } = require("../service/services");

const UserSchema = new mongoose.Schema(
    {
    fullname:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    ProfileImage:{
        type:String,
        required: false,
    }
},{timestamps:true}
);


UserSchema.pre("save", function (next) {
    const user= this;

    if(!user.isModified("password")) return;

    const salt= randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');
    this.salt=salt;
    this.password=hashedPassword;

    next();
});


UserSchema.statics.matchingPasswordGenerateToken = async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error('user not found');
    // console.log("users", user);
    const salt=user.salt;
    const hashedPassword=user.password;
    const userProvidedPassword=createHmac('sha256', salt)
    .update(password)
    .digest('hex');
    if(hashedPassword!== userProvidedPassword) 
        throw new Error('incorrect password');

    const token= createTokenForUser(user);
    // console.log(token);
    return token;
};

const User= mongoose.model('User',UserSchema);

module.exports=User;