const express = require("express");
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const router = express.Router();
const formidable = require("formidable");
const excelToJson = require("convert-excel-to-json");
const Errors = require("../helpers/Errors");
const CatchAsyncError = require("../helpers/CatchAsyncError");

// CREATE A ITEM
// URL : http://localhost:5000/items
// METHOD : POST
// REQUEST : { email, telephone, password }
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.post(
  "/",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const item = new Item(req.body);
      item.user = req.user._id;
      const response = await item.save();
      res.status(201).json(response);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// GET ITEMS
// URL : http://localhost:5000/items/search?page=1
// METHOD : GET
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201 [{Item}]
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

      const count = await Item.countDocuments({ ...keyword });
      const pages = Math.ceil(count / pageSize);

      const items = await Item.find({ ...keyword })
        .select(
          "_id logo name description rate content price android_file ios_file createdAt"
        )
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort("-updatedAt");

      res.send({ items, page, pages });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// GET ITEMS
// URL : http://localhost:5000/items
// METHOD : GET
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201 [{Item}]
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.get(
  "/",
  CatchAsyncError(async (req, res, next) => {
    try {
      let items = await Item.find().select(
      "_id logo name description rate content price android_file ios_file createdAt"
      );
      res.status(201).json(items);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// GET A ITEM
// URL : http://localhost:5000/items/:itemId
// METHOD : GET
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201 [{Item}]
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.get(
  "/:id",
  CatchAsyncError(async (req, res, next) => {
    try {
      const item = await Item.findById(req.params.id).select(
        "_id logo name description rate content price android_file ios_file createdAt"
      );
      res.status(201).json(item);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// UPDATE A ITEM
// URL : http://localhost:5000/items/:itemId
// METHOD : PUT
// REQUEST : { firstName, lastName, email, telephone, password }
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.put(
  "/:itemId",
  CatchAsyncError(async (req, res, next) => {
    try {
      const item = await Item.findByIdAndUpdate(req.params.itemId, req.body, {
        new: true,
      });
      res
        .status(201)
        .json({ success: true, message: "Modification éffectuée", item });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// DELETE ITEM LIST
// URL : http://localhost:5000/items
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
      const response = await Item.deleteMany({ _id: { $in: req.body.ids } });
      res.status(201).json(response);
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// DELETE A ITEM
// URL : http://localhost:5000/items/:itemId
// METHOD : DELETE
// REQUEST : null
// RESPONSE SUCCESS
// RESPONSE : STATUS - 201
// RESPONSE ERROR
// RESPONSE : STATUS - 401
router.delete(
  "/:id",
  auth,
  CatchAsyncError(async (req, res, next) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      res
        .status(201)
        .json({ success: true, message: "Item supprimé", item });
    } catch (error) {
      next(new Errors(error.message, 400));
    }
  })
);

// import items
router.post(
  "/import",
  auth,
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
            A: "logo",
            B: "name",
            C: "description",
            D: "content",
            E: "price",
            F: "rate",
            G: "android_file",
            H: "ios_file",
          },
        });

        data.map(async (d) => {
          try {
            const item = new Item(d);
            item.user = req.user._id;
            const response = await item.save();
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
