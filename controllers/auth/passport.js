
const dotenv = require("dotenv");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;var MicrosoftStrategy = require("passport-microsoft").Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

dotenv.config();
const User= require('./../../models/users/userModel');
const myEnum = require("./enumUser");

GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
LINKEDIN_KEY = process.env.LINKEDIN_KEY ;
LINKEDIN_SECRET= process.env.LINKEDIN_SECRET;
MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID ;
MICROSOFT_CLIENT_SECRET  = process.env.MICROSOFT_CLIENT_SECRET 

//google

  passport.use(
    'google-Candidate',
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: "/auth/google/callbackCandidate",
        },
    
         async (req,accessToken, refreshToken, profile,done) => { 
       //console.log(req);
          //check if user already exitsin our db
          User.findOne({ googleId: profile.id }).then( async function(currentUser) {
  
            if (currentUser) {
              console.log(currentUser)
              if (!currentUser.isCandidat){
              // currentUser.isCandidat=true
                 await User.findOneAndUpdate({googleId:profile.id,isCandidat:false},{$set:{isCandidat:true}},
                {new: true}, ) 
             // console.log("user is:", currentUser);
              done(null, currentUser);
            } else if (!currentUser) {
        
              new User({
                googleId: profile.id,
                firstName: profile._json.given_name,
                lastName : profile._json.family_name,
                email: profile.emails[0].value,
                picture: profile.photos[0].value,
                verified:true,
                isCandidat:true
                
              })
                .save()
                .then((newUser) => {
                 done(null, newUser);
                });
            }
          }});
        }
      )
    );
  
// login with microsoft

passport.use(
  'microsoft-Candidate',
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/microsoft/callbackCandidate",
      scope: ['openid', 'profile', 'email']  
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ googleId: profile.id }).then( async function(currentUser)  {
        if (currentUser) {
          if (!currentUser.isCandidat){
            await User.findOneAndUpdate({microsoftId:profile.id,isCandidat:false},{$set:{isCandidat:true}},
                {new: true}, ) 
          }
          done(null, currentUser);
        } else {
          new User({
            microsoftId: profile.id,
            FirstName: profile._json.givenName,
            lastName : profile.name.familyName,
            email: profile._json.mail,
            picture: profile.photos[0].value,
            verified:true,
            isCandidat:true
          })
            .save()
            .then((newUser) => {
             done(null, newUser);
            });
        }
      });
  
    }
  )
);

// login with linkedin 

passport.use(
  'Linkedin-Candidate',
  new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/auth/linkedin/callbackCandidate",
  scope: ['r_emailaddress', 'r_liteprofile'],
}, function(accessToken, refreshToken, profile, done) {

  User.findOne({ linkedinId: profile.id }).then( async function(currentUser) {
    if (currentUser) {
      if (!currentUser.isCandidat){
        await User.findOneAndUpdate({linkedinId:profile.id,isCandidat:false},{$set:{isCandidat:true}},
            {new: true}, ) 
      }
      done(null, currentUser);
    } else {
      new User({
        linkedinId: profile.id,
        firstName: profile.name.givenName,
        lastName : profile.name.familyName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        verified:true,
        isCandidat:true
     
      })
        .save()
        .then((newUser) => {
        done(null, newUser);
        });
    }
  });

}));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });