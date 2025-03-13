const User = require("../models/User");
const auth = require("../middleware/auth");
const router = require("express").Router();
const Utility = require("../helpers/Utility");
const Errors = require("../helpers/Errors");
const sendMail = require("../helpers/email");
const CatchAsyncError = require("../helpers/CatchAsyncError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Route d'inscription
router.post("/register", async (req, res, next) => {
  console.log("admin percute")
  try {
    
    const { firstName, lastName, phone, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà avec le même numéro de téléphone
    const isPhoneExist = await User.findOne({ phone });
    if (isPhoneExist) {
      return next(new Errors("Ce numéro de téléphone est déjà utilisé", 400));
    }

    // Vérifier si l'email est déjà utilisé
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec l'email
    const user = new User({
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      isActive: false, // L'utilisateur n'est pas activé tant qu'il n'a pas validé son email
    });

   
     console.log(user)
    // Générer le code d'activation
    const activation = Utility.generateActivationToken(user);

    // Envoi de l'email d'activation
    let data = { user, activationCode: activation.activationCode };
    await sendMail({
      to: user.email,
      subject: "Activation du compte",
      template: "activation-mail.ejs",
      data,
    });

    res.status(201).json({
      success: true,
      message: `Veuillez vérifier votre email : ${user.email} pour activer votre compte.`,
      activationToken: activation.token, // Peut être utilisé pour valider le code
    });
  } catch (error) {
    next(new Errors(error.message, 500));
  }
});


  //verification du type de user connecter
  router.get("/check-admin", auth, (req, res) => {
    res.status(200).json({ isAdmin: req.user.isAdmin });
  });

// ACTIVATE ACCOUNT
router.post(
  "/activation",
  CatchAsyncError(async (req, res, next) => {
    const { activation_token, activation_code } = req.body;
    console.log(activation_code, activation_token);
    const token = Utility.verifyActivationToken(activation_token);

    if (token.activationCode !== activation_code) {
      return next(new Errors("Activation code invalide!", 400));
    }

    const isEmailExist = await User.findOne({ email: token.email });
    if (isEmailExist) {
      return next(new Errors("Cette adresse exist déjà", 400));
    }

    const { firstName, lastName, email, password, phone, isActive } = token;

    // const fullName = `${firstName} ${lastName}`;

    let user = new User({ firstName, lastName, email, password ,phone,isActive});
    await user.save();

    const access_token = user.signAccessToken();

    res.status(200).json({
      success: true,
      user,
      token: access_token,
    });

    try {
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

//User password
router.post("/new_password", auth, async (req, res, next) => {
  try {
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (!isEmailExist) {
      return next(new Errors("Cet utilisateur n'existe pas", 400));
    }

    let hash_password = await bcrypt.hash(req.body.password, 8);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        email: req.body.email,
        password: hash_password,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});



router.post("/new2_password", auth, async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return next(new Errors("Cet utilisateur n'existe pas", 400));
    }

    // Vérifier si l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return next(new Errors("Ancien mot de passe incorrect", 400));
    }

    // Hasher le nouveau mot de passe
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès !",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});


// Update user's profile
router.put(
  "/update_profile",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
      });

      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

//User login
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new Errors("Cette adresse n'existe pas!", 400));
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
      return next(
        new Errors("Verifiez votre email ou password", 400)
      );
    }

    const access_token = user.signAccessToken();
    res.status(201).json({
      success: true,
      message: `Authentification reussit!`,
      token: access_token,
      user,
    });
  } catch (error) {
    console.log(error);
    return next(new Errors(error.message, 400));
  }
});


// User logout
router.post("/logout", auth, async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: "Déconnexion successful" });
  } catch (error) {
    next(error);
  }
});


// Get user's profile
router.get(
  "/me",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

// FORGOT PASSWORD
router.post(
  "/forgot-password",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(new Errors("aucun utilisateur trouvé", 400));
      }

      user.resetToken = {
        token: Math.floor(1000 + Math.random() * 9000).toString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      await user.save();

      await sendMail({
        to: user.email,
        subject: "Changer de mot de passe compte.",
        template: "password-reset-mail.ejs",
        data: { user },
      });

      res.status(200).send({
        success: true,
        message:
          "Veuillez vérifier votre adresse électronique pour les instructions de réinitialisation du mot de passe",
      });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

// VERIFY ACCOUNT
router.post(
  "/verify-code",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findOne({
        "resetToken.token": req.body.activation_code,
        "resetToken.expires": { $gt: Date.now() },
      });

      if (!user) {
        return next(new Errors("aucun utilisateur trouvé", 400));
      }

      // update password and remove reset token
      // user.password = req.body.password;
      // user.resetToken = undefined;
      await user.save();
      res.status(200).send({
        success: true,
        token: user.resetToken.token
      });
    } catch (error) {
      return next(new Errors(error.message, 400));
    }
  })
);

// RESET PASSWORD
router.post("/reset-password", CatchAsyncError(async (req, res, next) => {
  try {
      const user = await User.findOne({
          "resetToken.token": req.body.token,
          "resetToken.expires": { $gt: Date.now() },
      });

      if (!user) {
          return next(new Errors("Code invalide ou expiré", 400));
      }

      // Hasher le nouveau mot de passe
      user.password = await bcrypt.hash(req.body.password, 10);
      user.resetToken = undefined;
      await user.save();

      res.status(200).send({
          success: true,
          message: "Mot de passe réinitialisé avec succès !",
      });
  } catch (error) {
      return next(new Errors(error.message, 400));
  }
}));

module.exports = router;
