const Account = require("../../models/account.model");

const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false,
        });
        if (role) {
            record.role_id = role.title;
        }
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
    });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    const roles = await Role.find(find);

    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles,
    });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false,
    });

    if (emailExist) {
        req.flash("error", "Email này đã tồn tại");
        res.redirect("back");
    } else {
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };

    const account = await Account.findOne(find);

    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        account: account,
        roles: roles,
    });
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    const emailExist = await Account.findOne({
        _id: { $ne: req.params.id },
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

        await Account.updateOne(
            { _id: req.params.id, deleted: false },
            req.body
        );

        req.flash("success", "Cập nhật tài khoản thành công");
    }

    res.redirect("back");
};

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };

    const account = await Account.findOne(find);

    console.log(account.id);

    const roleAccount = await Role.findOne({
        deleted: false,
        _id: account.role_id,
    });

    console.log(roleAccount);

    res.render("admin/pages/accounts/detail", {
        pageTitle: "Thông tin tài khoản",
        account: account,
        roleAccount: roleAccount,
    });
};
