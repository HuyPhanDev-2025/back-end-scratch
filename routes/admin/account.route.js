const express = require("express");
const router = express.Router();

// multer package for upload files.
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/account.validate");

const controller = require("../../controllers/admin/account.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    // parameter 1 in upload.single is fieldname of form
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

router.get("/detail/:id", controller.detail);

// router.get("/permissions", controller.permissions);

// router.patch("/permissions", controller.permissionsPatch);

module.exports = router;
