const express = require("express");
const User = require("../models/User");
const router = express.Router();
const formidable = require("formidable");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CREATE A USER
// URL : http://localhost:5000/users
// METHOD : POST
// REQUEST : { email, telephone, password }
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.post(
  "/",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = new User(req.body);
      const response = await user.save();
      res.status(201).json(response);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// Route pour promouvoir un utilisateur en admin (accessible uniquement aux admins)
router.put("/make-admin/:id", auth, authAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new Errors("Utilisateur non trouvé", 404));

    user.isAdmin = true;
    await user.save();

    res.status(200).json({ success: true, message: "Utilisateur promu en admin", user });
  } catch (error) {
    next(new Errors(error.message, 500));
  }
});


// GET USERS
// URL : http://localhost:5000/users/search?page=1
// METHOD : GET
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201 [{User}]
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.get(
  "/search",
  CatchAsyncError(async (req, res, next) => {
    try {
      let keyword = req.query.q
        ? {
            firstName: { $regex: req.query.q, $options: "i" },
          }
        : {};
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.size) || 5;

      const count = await User.countDocuments({ ...keyword });
      const pages = Math.ceil(count / pageSize);

      const users = await User.find({ ...keyword })
        .select(
          "_id profilePicture firstName lastName email telephone createdAt"
        )
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort("-updatedAt");

      res.send({ users, page, pages });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// GET USERS
// URL : http://localhost:5000/users
// METHOD : GET
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201 [{User}]
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.get(
  "/", auth, authAdmin,
  CatchAsyncError(async (req, res, next) => {
    try {
      let page = parseInt(req.query.page) ;
      let limit = parseInt(req.query.limit) ;
      let skip = (page - 1) * limit;
      
      let totalUsers = await User.countDocuments();
      let users = await User.find()
        .select("_id profilePicture firstName lastName email phone createdAt")
        .skip(skip)
        .limit(limit);
      
      res.status(201).json({
        success: true,
        users,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);


//GET ADMIN LIST
router.get(
  "/admins", auth, authAdmin,
  CatchAsyncError(async (req, res, next) => {
    try {
      let page = parseInt(req.query.page) ;
      let limit = parseInt(req.query.limit);
      let skip = (page - 1) * limit;
      
      let totalAdmins = await User.countDocuments({ isAdmin: true });
      let admins = await User.find({ isAdmin: true })
        .select("_id profilePicture firstName lastName email phone isAdmin createdAt")
        .skip(skip)
        .limit(limit);
      
      res.status(200).json({
        success: true,
        admins,
        currentPage: page,
        totalPages: Math.ceil(totalAdmins / limit),
        totalAdmins
      });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

//GET CLIENT LIST
router.get(
  "/clients", auth, 
  CatchAsyncError(async (req, res, next) => {
    try {
      let page = parseInt(req.query.page) ;
      let limit = parseInt(req.query.limit) ;
      let skip = (page - 1) * limit;

      let totalClients = await User.countDocuments({ isAdmin: false });
      let clients = await User.find({ isAdmin: false })
        .select("_id profilePicture firstName lastName email phone isAdmin createdAt")
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        success: true,
        clients,
        currentPage: page,
        totalPages: Math.ceil(totalClients / limit),
        totalClients
      });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

//GET CLIENT WITHOUT PAGINATION
router.get(
  "/clients-no-pagination",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      let clients = await User.find({ isAdmin: false })
        .select("_id profilePicture firstName lastName email phone isAdmin createdAt");

      res.status(200).json({
        success: true,
        clients,
        totalClients: clients.length,
      });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);


// GET A USER
// URL : http://localhost:5000/users/:userId
// METHOD : GET
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201 [{User}]
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.get(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select(
        "_id profilePicture firstName lastName email telephone createdAt"
      );
      res.status(201).json(user);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// UPDATE A USER
// URL : http://localhost:5000/users/:userId
// METHOD : PUT
// REQUEST : { firstName, lastName, email, telephone, password }
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.put(
  "/:userId",
  auth,authAdmin,
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
      });
      res
        .status(201)
        .json({ success: true, message: "Modification éffectuée", user });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// METTRE À JOUR LE RÔLE D'UN UTILISATEUR
router.put(
  "/role/:userId",
  auth,authAdmin,
  CatchAsyncError(async (req, res, next) => {
    try {
      const { isAdmin } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { isAdmin },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: `Le rôle de ${user.firstName} a été mis à jour`,
        user,
      });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);


// DELETE A USER
// URL : http://localhost:5000/users/:userId
// METHOD : DELETE
// REQUEST : {ids : [id1,id2,...]}
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.post(
  "/more",
  CatchAsyncError(async (req, res, next) => {
    try {
      console.log(req.body);
      const response = await User.deleteMany({ _id: { $in: req.body.ids } });
      res.status(201).json(response);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// DELETE A USER
// URL : http://localhost:5000/users/:userId
// METHOD : DELETE
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.delete(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res
        .status(201)
        .json({ success: true, message: "Utilisateur supprimé", user });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

//Delete more users
router.post(
  "/more",
  CatchAsyncError(async (req, res, next) => {
    try {
      const response = await User.deleteMany({ _id: { $in: req.body } });
      res.status(201).json(response);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// import users
router.post(
  "/import",
  CatchAsyncError(async (req, res, next) => {
    try {
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.status(400).json({
            message: "Data could not be uploaded",
          });
        }

        const { data } = excelToJson({
          sourceFile: files.excelFile.filepath,
          columnToKey: {
            A: "firstName",
            B: "lastName",
            C: "email",
            D: "telephone",
            E: "password",
          },
        });

        data.map(async (d) => {
          try {
            const user = new User(d);
            const response = await user.save();
            res.status(201).json(response);
          } catch (error) {
            next(new Errors(error.message, 400));
          }
        });
      });
    } catch (error) {
      console.log(error);
      next(new Errors(error.message, 400));
    }
  })
);

module.exports = router;
