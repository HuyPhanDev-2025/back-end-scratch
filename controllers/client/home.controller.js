const ProductCatalogue = require("../../models/product-catalogue.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const productsCatalog = await ProductCatalogue.find(find);

    // Cannot just pass this to home page, header and other pages also need, so make it public
    const newProductsCatalog = createTreeHelper.createTree(productsCatalog);

    res.render("client/pages/home/index", {
        pageTitle: "Home Page",
        layoutProductsCatalog: newProductsCatalog,
    });
};
