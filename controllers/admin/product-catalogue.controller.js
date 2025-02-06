const ProductCatalogue = require("../../models/product-catalogue.model");

const systemConfig = require("../../config/system");

const statusFilterHelper = require("../../helpers/statusFilter");

const searchHelper = require("../../helpers/search");

const paginationHelper = require("../../helpers/pagination");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-catalogue
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

    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword) {
        find.title = objectSearch.regex;
    }
    // End Search

    // ======= Pagination =======
    const countRecords = await ProductCatalogue.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4,
        },
        req.query,
        countRecords
    );

    // ======= End Pagination =======

    // ======= Sort =======
    let sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }

    const records = await ProductCatalogue.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    const allRecords = await ProductCatalogue.find(find);

    const treeRecords = createTreeHelper.createTree(allRecords);

    res.render("admin/pages/products-catalogue/index", {
        pageTitle: "Product Catalogue",
        records: records,
        treeRecords: treeRecords,
        statusFilter: statusFilter,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        situation: "products-catalogue",
    });
};

// [GET] /admin/products-catalogue/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCatalogue.find(find);

    const newRecords = createTreeHelper.createTree(records);

    res.render("admin/pages/products-catalogue/create", {
        pageTitle: "Product Catalogue Generation",
        records: newRecords,
    });
};

// [PATCH] /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await ProductCatalogue.updateOne({ _id: id }, { status: status });

    req.flash("success", `Cập nhật trạng thái sản phẩm thành công`);

    res.redirect("back");
};

// [PATCH] /change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            await ProductCatalogue.updateMany(
                { _id: { $in: ids } },
                { status: type }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
            );
            break;
        case "inactive":
            await ProductCatalogue.updateMany(
                { _id: { $in: ids } },
                { status: type }
            );
            req.flash(
                "success",
                `Cập nhật trạng thái ${ids.length} sản phẩm thành công`
            );
            break;
        case "delete-all":
            await ProductCatalogue.updateMany(
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

                await ProductCatalogue.updateOne(
                    { _id: id },
                    { position: position }
                );
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
    await ProductCatalogue.updateOne(
        { _id: id },
        { deleted: true, deletedAt: new Date() }
    );

    res.redirect("back");
};

// [POST] /admin/products-catalogue
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProductCatalogue = await ProductCatalogue.countDocuments();
        req.body.position = countProductCatalogue + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    const record = new ProductCatalogue(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-catalogue`);
};
