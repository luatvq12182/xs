// Import necessary modules
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

// Set up options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET, // Store your secret key in environment variables
};

// Create a JWT Strategy
const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
    // You can perform a database lookup to find the user based on payload.sub (subject)
    // For this example, we'll assume a simple user object is stored in the payload
    const user = payload;

    if (user) {
        return done(null, user);
    } else {
        return done(null, false);
    }
});

// Use the JWT Strategy with Passport
passport.use(jwtStrategy);
