const dotenv = require("dotenv");
const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var MicrosoftStrategy = require("passport-microsoft").Strategy;
var LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
dotenv.config();
const User = require("./../../models/users/userModel");
GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
LINKEDIN_KEY = process.env.LINKEDIN_KEY;
LINKEDIN_SECRET = process.env.LINKEDIN_SECRET;
MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;

passport.use(
  "google-Quizmaster",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callbackQuizmaster",
    },

    async (accessToken, refreshToken, profile, done) => {
      User.findOne({ email: profile.emails[0].value }).then(async function (
        currentUser
      ) {
        if (currentUser) {
          await User.findOneAndUpdate(
            { email: profile.emails[0].value },
            { $set: { googleId: profile.id } },
            { new: true }
          );

          console.log("user is:", currentUser);
          done(null, currentUser);
        } else {
          //check if user already exitsin our db
          User.findOne({ googleId: profile.id }).then(async function (
            currentUser
          ) {
            if (currentUser) {
              //check if  quizmaster is false to update him to true without creation new account
              if (!currentUser.isQuizmaster) {
                await User.findOneAndUpdate(
                  { google: profile.id, isQuizmaster: false },
                  { $set: { isQuizmaster: true } },
                  { new: true }
                );
              }
              console.log("user is:", currentUser);
              done(null, currentUser);
            } else if (!currentUser) {
              new User({
                googleId: profile.id,
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,
                email: profile.emails[0].value,
                picture: profile.photos[0].value,
                verified: true,
                isQuizmaster: true,
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
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ linkedinId: profile.id }).then(async function (
        currentUser
      ) {
        if (currentUser) {
          if (!currentUser.isQuizmaster) {
            await User.findOneAndUpdate(
              { linkedinId: profile.id, isQuizmaster: false },
              { $set: { isQuizmaster: true } },
              { new: true }
            );
          }
          console.log("user is:", currentUser);
          done(null, currentUser);
        } else {
          new User({
            linkedinId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            verified: true,
            isQuizmaster: true,
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
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ microsoftId: profile.id }).then(async function (
        currentUser
      ) {
        if (currentUser) {
          if (!currentUser.isQuizmaster) {
            await User.findOneAndUpdate(
              { microsoftId: profile.id, isQuizmaster: false },
              { $set: { isQuizmaster: true } },
              { new: true }
            );
          }
          done(null, currentUser);
        } else {
          new User({
            microsoftId: profile.id,
            firstName: profile._json.displayName,
            lastName: profile.name.family_name,
            email: profile._json.mail,
            verified: true,
            isQuizmaster: true,
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
  User.findById(id).then((user) => {
    done(null, user);
  });
});
