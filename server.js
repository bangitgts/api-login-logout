const express = require("express");
const app = express();
const port = 4000;
var morgan = require("morgan");
const bodyParser = require("body-parser");
const AccountModel = require("./models/account");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const checkToken = require("./auth/checkToken");
var cors = require('cors');
//use cors
app.use(cors())
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/account", checkToken, (req, res, next) => {

    AccountModel.findOne({
            username: req.body.username,
            password: req.body.password,
        })
        .then((data) => {
            res.json({
                status: 200,
                success: true,
                data: {
                    _id: data._id,
                    username: data.username
                },
                message: "Đăng nhập thành công"
            });
        })
        .catch((err) => console.log(err));
});

app.post("/account/register", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    AccountModel.findOne({ username: username })
        .then((data) => {
            if (data) {
                return res.status(400).json({
                    message: "Account created failed. Account has been duplicated",
                    status: 400,
                    success: false
                });
            } else {
                AccountModel.create({
                    username: username,
                    password: password,
                    cart: []
                });
            }
        })
        .then((data) => {
            return res.status(200).json({
                message: "Account created successfully",
                status: 200,
                success: true
            })
        })
        .catch((err) => res.status(500).json("Server 500"));
});
app.post("/account/login", (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    AccountModel.findOne({
            username: username,
            password: password,
        })
        .then((data) => {
            if (data) {
                let token = jwt.sign({
                        _id: data._id,
                    },
                    "password"
                );
                res.header("auth-token", token);

                res.status(200).json({
                    message: "Loggin successfully",
                    data: {
                        username: username,
                        password: password,
                        token: token
                    },
                    success: true,
                    status: 200,
                });
            } else {
                return res.status(400).json({
                    message: "Loggin failed. Account or password does not match",
                    success: false,
                    status: 400,
                });
            }
        })
        .catch((err) => res.status(500).json("Có lỗi sever"));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});