const Errors = require("../helpers/Errors");

const authAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new Errors("Accès refusé. Vous devez être administrateur.", 403));
  }
  next();
};

module.exports = authAdmin;
