const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product-catalogue.controller");
// multer package for upload files.
const multer = require("multer");
const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/product-catalogue.validate");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

module.exports = router;
