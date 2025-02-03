const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");

const statusFilterHelper = require("../../helpers/statusFilter");

const searchHelper = require("../../helpers/search");

const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // Filtering status
    const statusFilter = statusFilterHelper(req.query);

    // conditional object to query
    let find = {
        deleted: false,
    };

    // If user enter condition to query
    if (req.query.status) {
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);

    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }

    // ======= Pagination =======
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4,
        },
        req.query,
        countProducts
    );

    // ======= End Pagination =======

    const products = await Product.find(find)
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Product List Page",
        products: products,
        statusFilter: statusFilter,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
    });
};

// [PATCH] /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", `Cập nhật trạng thái sản phẩm thành công`);

    res.redirect("back");
};

// [PATCH] /change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash(
                "success",
                `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
            );
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: type });
            req.flash(
                "success",
                `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
            );
            break;
        case "delete-all":
            await Product.updateMany(
                { _id: { $in: ids } },
                { deleted: true, deletedAt: new Date() }
            );
            req.flash(
                "success",
                `Đã xóa thành công ${ids.length} sản phẩm thành công`
            );
            break;
        case "change-position":
            // await
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);

                await Product.updateOne({ _id: id }, { position: position });
            }
            req.flash(
                "success",
                `Đã thay đổi vị trí thành công ${ids.length} sản phẩm thành công`
            );
            break;
        default:
            break;
    }

    res.redirect("back");
};

// [DELETE] /delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id });
    await Product.updateOne(
        { _id: id },
        { deleted: true, deletedAt: new Date() }
    );

    res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Cập nhật thành công");
    } catch (error) {
        req.flash("error", "Cập nhật thất bại");
    }

    res.redirect(`back`);
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
