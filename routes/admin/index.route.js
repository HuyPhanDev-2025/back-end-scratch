const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCatalogueRoutes = require("./product-catelogue.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");

module.exports = (app) => {
    const adminPath = systemConfig.prefixAdmin;

    app.use(adminPath + "/dashboard", dashboardRoutes);

    app.use(adminPath + "/products", productRoutes);

    app.use(adminPath + "/products-catalogue", productCatalogueRoutes);

    app.use(adminPath + "/roles", roleRoutes);

    app.use(adminPath + "/accounts", accountRoutes);

    app.use(adminPath + "/auth", authRoutes);
};
