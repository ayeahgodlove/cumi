import User from "@data/entities/user";
import Passport from "passport";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";

export const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "mysecretekey", // Replace with your actual secret key
};

Passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Find the user associated with the JWT token
      const user = await User.findByPk(jwtPayload.id);

      if (user) {
        // If the user exists, return them
        return done(null, user);
      } else {
        return done(null, false, { message: "Invalid username or password!" });
      }
    } catch (error) {
      return done(error, false, { message: "Invalid username or password!" });
    }
  })
);

export default Passport;
