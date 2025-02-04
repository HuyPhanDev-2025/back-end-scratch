const ProductCatalogue = require("../../models/product-catalogue.model");

const systemConfig = require("../../config/system");

// [GET] /admin/products-catalogue
module.exports.index = async (req, res) => {
    // conditional object to query
    let find = {
        deleted: false,
    };

    const records = await ProductCatalogue.find(find);

    res.render("admin/pages/products-catalogue/index", {
        pageTitle: "Product Catalogue",
        records: records,
    });
};

// [GET] /admin/products-catalogue
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-catalogue/create", {
        pageTitle: "Product Catalogue Generation",
    });
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
