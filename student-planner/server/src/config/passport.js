const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Only configure Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  // Debug logging
  console.log('🔵 OAuth Strategy Configured:');
  console.log(`   - Client ID: ${process.env.GOOGLE_CLIENT_ID?.substring(0, 10)}...`);
  console.log(`   - Callback URL: ${process.env.GOOGLE_CALLBACK_URL}`);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🔹 Google Callback received');
          console.log(`   - Profile ID: ${profile.id}`);
          console.log(`   - Email: ${profile.emails?.[0]?.value}`);

          // Check if user already exists
          console.log('   Starting User.findOne...');
          let user = await User.findOne({
            where: { email: profile.emails[0].value }
          });
          console.log(`   User found: ${!!user}`);

          if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
              console.log('   Updating existing user with Google ID...');
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          console.log('   Creating new user...');
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            password: Math.random().toString(36).slice(-8), // Random password for Google users
          });
          console.log('   User created successfully.');

          done(null, user);
        } catch (error) {
          console.error('❌ Google Strategy Error:', error);
          done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth strategy configured');
} else {
  console.log('⚠️  Google OAuth credentials not found. Google sign-in will be disabled.');
}

module.exports = passport;
