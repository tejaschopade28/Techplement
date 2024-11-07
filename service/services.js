
const JWT= require('jsonwebtoken');
const secret = "Itsasecretkey"; 

function createTokenForUser(user){
    const payload={
        _id : user._id,
        email :user.email,
        fullname: user.fullname,
        ProfileImage : user.ProfileImage,
    }; 
    // console.log("load",payload);
    const token= JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload= JWT.verify(token, secret);
    // console.log("payload",payload);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken,
};