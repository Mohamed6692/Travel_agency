const jwt = require("jsonwebtoken");
const Errors = require("../helpers/Errors");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("sss",token);
    
    if (!token) {
      console.log("Token manquant");
      throw new Error("Token manquant");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("EN SEC",process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    req.token = token;
    req.user = user; // Maintenant, req.user.isAdmin est accessible

    next();
  } catch (error) {
    return next(new Errors(error.message, 401));
  }
};


module.exports = auth;
