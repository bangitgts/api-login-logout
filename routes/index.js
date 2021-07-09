const accountRouter = require("./account.route");
const productRouter = require("./product.route");

function route(app) {
    app.use("/account", accountRouter);
    app.use("/product", productRouter);
}

module.exports = route;