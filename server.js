const express = require("express");
const app = express();
let path = require("path");
const port = 4000;
var morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const route = require("./routes/index.js");
const cors = require("cors");
//use cors
app.use(cors());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(morgan("combined"));

route(app);

app.get("/view/:id", (req, res) => {
    res.sendFile(path.join(`${__dirname}/uploads/${req.params.id}`));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});