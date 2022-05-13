
const dotenv = require("dotenv");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var MicrosoftStrategy = require("passport-microsoft").Strategy;
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const Candidate = require("../../models/users/candidateModel")
dotenv.config();
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
  
      async (accessToken, refreshToken, profile, done)=> {
        Candidate.findOne({ email: profile.emails[0].value }).then(async function (currentUser){
            if (currentUser) {
              await Candidate.findOneAndUpdate(
                { email: profile.emails[0].value },
                { $set: { googleId: profile.id } },
                { new: true }
              );
    
              console.log("user is:", currentUser);
              done(null, currentUser);
            }else if (!currentUser) {
      
            new Candidate({
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
        });
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
      callbackURL: "/auth/microsoft/callbackCandidate",
      scope: ['openid', 'profile']  
    },
    async (accessToken, refreshToken, profile, done)=> {
        Candidate.findOne({ email: profile.emails[0].value }).then(async function (currentUser){
            if (currentUser) {
              await Candidate.findOneAndUpdate(
                { email: profile.emails[0].value },
                { $set: { googleId: profile.id } },
                { new: true }
              );
    
              console.log("user is:", currentUser);
              done(null, currentUser);
            } else {
          new Candidate({
            microsoftId: profile.id,
            firstName: profile._json.displayName,
            lastName : profile.name.family_name,
            email: profile._json.mail,
            verified:true,
            // isCandidat:true
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
  'linkedin-Candidate',
  new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/auth/linkedin/callbackCandidate",
  scope: ['r_emailaddress', 'r_liteprofile'],
}, async (accessToken, refreshToken, profile, done)=> {
    Candidate.findOne({ email: profile.emails[0].value }).then(async function (currentUser){
        if (currentUser) {
          await Candidate.findOneAndUpdate(
            { email: profile.emails[0].value },
            { $set: { googleId: profile.id } },
            { new: true }
          );

          console.log("user is:", currentUser);
          done(null, currentUser);
        }  else {
      new Candidate({
        linkedinId: profile.id,
        firstName: profile.name.givenName,
        lastName : profile.name.familyName,
        email: profile.emails[0].value,
        picture: profile.photos[0].value,
        verified:true,
        // isCandidat:true
     
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
    Candidate.findById(id).then((user) => {
      done(null, user);
    });
  });