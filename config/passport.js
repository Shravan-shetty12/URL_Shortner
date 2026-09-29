const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.trim().toLowerCase();

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        if (err.code === 11000) {
          // Another request may have created the user simultaneously
          const user = await User.findOne({
            email: profile.emails[0].value.trim().toLowerCase(),
          });

          if (user) {
            return done(null, user);
          }
        }

        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    },
  ),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
