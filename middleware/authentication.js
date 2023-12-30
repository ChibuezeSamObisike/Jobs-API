const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/unauthenticated");

const auth = (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    //This is same as decode but this verifies with our private key and token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    //Attach user to job routes
    //Alternative method
    //const user=User.findById(payload.id).select('-password')
    //req.user=user
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (ex) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
