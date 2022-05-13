const dotenv = require("dotenv");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var MicrosoftStrategy = require("passport-microsoft").Strategy;
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
dotenv.config();
GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
LINKEDIN_KEY = process.env.LINKEDIN_KEY;
LINKEDIN_SECRET = process.env.LINKEDIN_SECRET;
MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const QuizMaster=require("../../models/users/quizmasterModel")
passport.use(
  "google-Quizmaster",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callbackQuizmaster",
    },

    async (accessToken, refreshToken, profile, done) => {
        QuizMaster.findOne({ email: profile.emails[0].value }).then(async function (
        currentUser
      ) {
        if (currentUser) {
          await QuizMaster.findOneAndUpdate(
            { email: profile.emails[0].value },
            { $set: { googleId: profile.id } },
            { new: true }
          );

          console.log("user is:", currentUser);
          done(null, currentUser);
        } else {
          //check if user already exitsin our db
          QuizMaster.findOne({ googleId: profile.id }).then(async function (
            currentUser
          ) {
            if (currentUser) {
              console.log("user is:", currentUser);
              done(null, currentUser);
            } else if (!currentUser) {
              new QuizMaster({
                googleId: profile.id,
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,
                email: profile.emails[0].value,
                picture: profile.photos[0].value,
                verified: true,
              })
                .save()
                .then((newUser) => {
                  done(null, newUser);
                });
            }
          });
        }
      });
    }
  )
);

// linkedin

passport.use(
  "linkedin-Quizmaster",
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_KEY,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: "/auth/linkedin/callbackQuizmaster",
      scope: ["r_emailaddress", "r_liteprofile"],
    },
    async (accessToken, refreshToken, profile, done)=> {
        QuizMaster.findOne({ email: profile.emails[0].value }).then(async function (currentUser){
            if (currentUser) {
              await QuizMaster.findOneAndUpdate(
                { email: profile.emails[0].value },
                { $set: { googleId: profile.id } },
                { new: true }
              );
    
              console.log("user is:", currentUser);
              done(null, currentUser);
            } else {
        QuizMaster.findOne({ linkedinId: profile.id }).then(async function (
        currentUser
      ) {
        if (currentUser) {
          console.log("user is:", currentUser);
          done(null, currentUser);
        } else {
          new QuizMaster({
            linkedinId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            verified: true,
            // isQuizmaster: true,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }

      }
    );
    }
}
);
    }));
  
// microsoft
passport.use(
  "microsoft-Quizmaster",
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "/auth/microsoft/callbackQuizmaster",
      scope: ["openid", "profile", "email"],
    },
    async (accessToken, refreshToken, profile, done)=> {
        QuizMaster.findOne({ email: profile.emails[0].value }).then(async function (currentUser){
            if (currentUser) {
              await QuizMaster.findOneAndUpdate(
                { email: profile.emails[0].value },
                { $set: { googleId: profile.id } },
                { new: true }
              );
    
              console.log("user is:", currentUser);
              done(null, currentUser);
            } else {
          new QuizMaster({
            microsoftId: profile.id,
            firstName: profile._json.displayName,
            lastName: profile.name.family_name,
            email: profile._json.mail,
            verified: true,
            //isQuizmaster: true,
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
    QuizMaster.findById(id).then((user) => {
    done(null, user);
  });
});
