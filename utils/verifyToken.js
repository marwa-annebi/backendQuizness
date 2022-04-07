const jwt = require("jsonwebtoken");
const Token=require ("../models/users/tokenModel");
 async function verifyToken(req,res,next){
    try{
   // const token=req.header("auth-token");
//    const {userId}=req.body;
   let token =  await Token.findById(req.params.id);
   console.log(token);
     if(!token) return res.status(401).send("access denied");
     if (token){
 const expiredToken=token.expires;
  console.log(expiredToken);

        // const verified=jwt.verify(token,process.env.TOKEN_SECRET);
        // req.user=verified;
        if (Date.now() > expiredToken)
        {
            token.remove()
            res.status(400).send("token expired");
        }
        else {
            res.status(400).send({token});

        }
        next();}
    } catch (error){
        res.json({
            status: "FAILED",
            message: error.message,
          });
    }
};
module.exports=verifyToken