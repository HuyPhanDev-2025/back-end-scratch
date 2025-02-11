const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Individual Info Page",
    });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Edit Individual Info Page",
    });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    id = res.locals.user.id;

    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false,
    });

    if (emailExist) {
        req.flash("error", "Email này đã tồn tại");
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password;
        }
    }

    await Account.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật thông tin cá nhân thành công!");

    res.redirect("back");
};
