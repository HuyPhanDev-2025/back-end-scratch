const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");

module.exports = (app) => {
    const adminPath = systemConfig.prefixAdmin;
    app.use(adminPath + "/dashboard", dashboardRoutes);
    app.use(adminPath + "/products", productRoutes);
};
