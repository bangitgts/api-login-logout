const express = require("express");
const app = express();
const port = 4000;
var morgan = require("morgan");
const bodyParser = require("body-parser");
const AccountModel = require("./models/account");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const checkToken = require("./auth/checkToken");
var cors = require("cors");
//use cors
app.use(cors());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/account", checkToken, (req, res, next) => {
    AccountModel.findOne({
            email: req.body.email,
            password: req.body.password,
        })
        .then((data) => {
            res.status(200).json({
                status: 200,
                success: true,
                data: {
                    _id: data._id,
                    email: data.email,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    dateBirth: data.dateBirth,
                    sex: data.sex,
                    introduce: data.introduce,
                },
                message: "Đăng nhập thành công",
            });
        })
        .catch((err) => {
            res.status(400).json({
                status: 400,
                success: false,
                message: "Đăng nhập không thành công",
            });
        });
});

app.post("/account/register", (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    AccountModel.findOne({ email: email })
        .then((data) => {
            if (data) {
                return res.status(400).json({
                    message: "Account created failed. Account has been duplicated",
                    status: 400,
                    success: false,
                });
            } else {
                AccountModel.create({
                    name: name,
                    email: email,
                    password: password,
                    address: "",
                    phoneNumber: "",
                    dateBirth: "",
                    sex: null,
                    introduce: "",
                });
            }
        })
        .then((data) => {
            return res.status(200).json({
                message: "Account created successfully",
                data: {
                    name: name,
                    email: email,
                },
                status: 200,
                success: true,
            });
        })
        .catch((err) => res.status(500).json("Server 500"));
});
app.post("/account/login", (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    AccountModel.findOne({
            email: email,
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
                        email: email,
                        password: password,
                        token: token,
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