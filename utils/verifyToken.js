const jwt = require("jsonwebtoken");

//const Token=require ("../models/users/tokenModel");
function verifyToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];
    console.log(token);
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.status(200).send(decoded);
        // User.findById(decoded.id, function (err, user) {
        //     if (err) return res.status(500).send("There was a problem finding the user.");
        //     if (!user) return res.status(404).send("No user found.");
            
        //     res.status(200).send(user);}
        
        } catch (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      }
      

  


}



//     try{


//      if(!token) return res.status(401).send("access denied");
//      if (token){
//  const expiredToken=token.expiresAt;
//   console.log(expiredToken);

//         // const verified=jwt.verify(token,process.env.TOKEN_SECRET);
//         // req.user=verified;
//         if (Date.now() > expiredToken)
//         {
//             token.remove()
//             res.status(400).send("token expired");
//         }
//         else {
//             res.status(400).send({token});

//         }
//         next();}
//     } catch (error){
//         res.json({
//             status: "FAILED",
//             message: error.message,
//           });
//     }
;
module.exports=verifyToken;

