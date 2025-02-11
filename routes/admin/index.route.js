const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCatalogueRoutes = require("./product-catelogue.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myAccountRoutes = require("./my-account.route");

module.exports = (app) => {
    const adminPath = systemConfig.prefixAdmin;

    app.use(
        adminPath + "/dashboard",
        authMiddleware.requireAuth,
        dashboardRoutes
    );

    app.use(adminPath + "/products", authMiddleware.requireAuth, productRoutes);

    app.use(
        adminPath + "/products-catalogue",
        authMiddleware.requireAuth,
        productCatalogueRoutes
    );

    app.use(adminPath + "/roles", authMiddleware.requireAuth, roleRoutes);

    app.use(adminPath + "/accounts", authMiddleware.requireAuth, accountRoutes);

    app.use(adminPath + "/auth", authRoutes);

    app.use(
        adminPath + "/my-account",
        authMiddleware.requireAuth,
        myAccountRoutes
    );
};
