const jwt = require("jsonwebtoken");
const { findById } = require("../models/users/adminModel");

function verifyToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers["x-access-token"];
    console.log(token);
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await findById(decoded.id)
        if (user){
          return res.status(404).send({ auth: false, message: 'user not exist' })
        }
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

module.exports=verifyToken;


