import passport from "passport";
import {
  Strategy as googleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import User from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStreategy } from "passport-local";
import bcrypt from 'bcryptjs'
import statusCodes from 'http-status-codes'

// Implement credential based authentication
passport.use(
  new LocalStreategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          return done(null, false, { message: "user does not exist" });
        }

        // check if the user is google authenticated user
        const isGoogleAuthenticated = existingUser.auths?.some(providerObject => providerObject.provider === 'google')

        if(isGoogleAuthenticated && !existingUser.password){
            return done('You have authenticated through google. If you want to login with credential, then first login with google and then set a password. Then you can login with credential.')
        }

        const isPasswordMatchd = await bcrypt.compare(
          password as string,
          existingUser.password as string
        );

        if (!isPasswordMatchd) {
          return done(null, false, {message: 'password is not valid'})
        }

        return done(null, existingUser)
 
      } catch (error: any) {
        console.log(error);
        done(error);
      }
    }
  )
);

// Implement google authentication
passport.use(
  new googleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("google strategy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
