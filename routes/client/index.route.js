const catalogMiddleware = require("../../middlewares/client/catalog.middleware");

const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");

module.exports = (app) => {
    app.use(catalogMiddleware.catalog);

    app.use("/", homeRoutes);

    app.use("/products", productRoutes);
};
