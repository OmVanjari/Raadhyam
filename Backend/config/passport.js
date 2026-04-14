import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

// Load environment variables from the project root .env file
// Using default config will search for .env in the current working directory (project root)
dotenv.config();

// Only configure Google Strategy if ALL credentials are present
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

console.log('Passport config check - GOOGLE_CLIENT_ID:', clientId ? 'set' : 'not set');
console.log('Passport config check - GOOGLE_CLIENT_SECRET:', clientSecret ? 'set' : 'not set');
console.log('Passport config check - GOOGLE_CALLBACK_URL:', callbackUrl ? 'set' : 'not set');

try {
  if (clientId && clientSecret && callbackUrl) {
    console.log('Configuring Google OAuth Strategy...');
    
    passport.use(
      new GoogleStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
          prompt: 'consent', // Force Google to show consent screen on every login
        },
        async (accessToken, refreshToken, profile, done) => {
          console.log('[Passport Google Strategy] Received profile from Google:', {
            googleId: profile.id,
            email: profile.emails?.[0]?.value,
            displayName: profile.displayName
          });
          
          try {
            const User = (await import('../models/users.js')).default;
            
            // Check if user exists by googleId
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
              console.log('[Passport Google Strategy] Found user by googleId:', user.email);
              return done(null, user);
            }

            // Check if user exists by email
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              console.log('[Passport Google Strategy] Found user by email, linking googleId:', user.email);
              user.googleId = profile.id;
              user.name = profile.displayName;
              user.avatar = profile.photos[0].value;
              await user.save();
              return done(null, user);
            }

            // Generate a unique username from the name
            const baseUsername = profile.displayName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
            let username = baseUsername;
            let counter = 1;
            
            // Ensure username is unique
            while (await User.findOne({ username })) {
              username = `${baseUsername}_${counter}`;
              counter++;
            }
            console.log('[Passport Google Strategy] Creating new user with username:', username);

            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              avatar: profile.photos[0].value,
              username: username,
              slug: username, // Use username as slug to ensure uniqueness
            });
            await user.save();
            console.log('[Passport Google Strategy] New user created successfully:', user.email);
            done(null, user);
          } catch (error) {
            console.error('[Passport Google Strategy] Error in strategy callback:', error);
            done(error, null);
          }
        }
      )
    );
    console.log('Google OAuth Strategy configured successfully');
  } else {
    console.log('Google OAuth credentials not fully configured - Google login disabled');
  }
} catch (err) {
  console.error('Error configuring Google OAuth Strategy:', err.message);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const User = (await import('../models/users.js')).default;
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;