const express = require("express");
const app = express();
const port = 4000;
var morgan = require("morgan");
const bodyParser = require("body-parser");
const AccountModel = require("./models/account");
const BookModel = require("./models/databook");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const checkToken = require("./auth/checkToken");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";
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
            _id: req.user,
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
                    cart: [],
                    createDate: new Date(),
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

// product & cart
app.get("/product", (req, res, next) => {
    BookModel.find({})
        .then((data) => {
            return res.status(200).json({
                message: "BookStore",
                success: true,
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Fail",
                success: false,
                status: 401,
            });
        });
});

app.get("/product/loai1", (req, res, next) => {
    BookModel.find({ loaisach: "loai1" })
        .then((data) => {
            return res.status(200).json({
                message: "BookStore loai 1",
                success: true,
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Fail",
                success: false,
                status: 401,
            });
        });
});

app.get("/product/loai2", (req, res, next) => {
    BookModel.find({ loaisach: "loai2" })
        .then((data) => {
            return res.status(200).json({
                message: "BookStore loai 2",
                success: true,
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Fail",
                success: false,
                status: 401,
            });
        });
});

app.get("/product/loai3", (req, res, next) => {
    BookModel.find({ loaisach: "loai3" })
        .then((data) => {
            return res.status(200).json({
                message: "BookStore loai 3",
                success: true,
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Fail",
                success: false,
                status: 401,
            });
        });
});

app.get("/product/loai4", (req, res, next) => {
    BookModel.find({ loaisach: "loai4" })
        .then((data) => {
            return res.status(200).json({
                message: "BookStore loai 4",
                success: true,
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Fail",
                success: false,
                status: 401,
            });
        });
});

app.get("/product/show/:_id", (req, res, next) => {
    BookModel.findOne({ _id: req.params._id })
        .then((data) => {
            console.log(typeof data)
            return res.status(200).json({
                message: "Thông tin của Sách",
                success: true,
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            return res.status(401).json({
                message: "Không tìm thấy sách",
                success: false,
                status: 401,
            });
        });
});



app.get("/product/cart", checkToken, (req, res, next) => {
    AccountModel.findOne({
        _id: req.user,
    })

    .then((data) => {
            res.status(200).json({
                status: 200,
                success: true,
                email: data.email,
                cart: data.cart,
                message: "Cart Data",
            });
        })
        .catch((err) => {
            res.status(400).json({
                status: 400,
                success: false,
                message: "Cart Found",
            });
        });
});

app.post("/product/add/:_id", checkToken, (req, res, next) => {
    const productAdd = req.params._id;
    const amount = req.body.amount;
    BookModel.findOne({ _id: productAdd })
        .then((data) => {
            const item = {
                _id: data._id,
                tenSach: data.tenSach,
                khoSach: data.khoSach,
                theLoai: data.theLoai,
                tacGia: data.tacGia,
                nxb: data.nxb,
                phathanhthang: data.phathanhthang,
                loaisach: data.loaisach,
                urlImage: data.urlImage,
                giaBia: data.giaBia,
                amount: amount,
            };
            console.log(item);

            AccountModel.findOne({ _id: req.user }).then((data) => {
                // for (let book of data.cart) {
                //     if (item._id !== book._id) {
                //         data.cart.push(item);
                //         data.save();
                //     }
                // }
                const boolBook = data.cart.find((ele) => ele._id == productAdd);
                if (boolBook === undefined) {
                    data.cart.push(item);
                    data.save();
                } else {
                    //  console.log(typeof data.cart);
                    const temp = data.cart;
                    data.cart = [];
                    let indexBook = temp.findIndex((el) => el === boolBook);
                    const removed = temp.splice(indexBook, 1);
                    const totalAmount = parseInt(item.amount) + parseInt(boolBook.amount);
                    const itemChange = {
                        _id: item._id,
                        tenSach: item.tenSach,
                        khoSach: item.khoSach,
                        theLoai: item.theLoai,
                        tacGia: item.tacGia,
                        nxb: item.nxb,
                        phathanhthang: item.phathanhthang,
                        loaisach: item.loaisach,
                        urlImage: item.urlImage,
                        giaBia: item.giaBia,
                        amount: String(totalAmount),
                    };
                    temp.splice(indexBook, 0, itemChange);

                    for (let item of temp) {
                        data.cart.push(item);
                    }
                    data.save();
                }
            });

            res.status(200).json({
                message: "Add successful",
                success: true,
                status: 200,
            });
        })

    .catch((err) => {
        res.status(500).json({
            message: "No products found",
            success: false,
            status: 500,
        });
    });
});

app.put("/product/change/:_id", checkToken, (req, res, next) => {
    const amount = req.body.amount;
    AccountModel.findOne({ _id: req.user })
        .then((data) => {
            const temp = data.cart;
            data.cart = [];
            let indexBook = temp.findIndex((el) => el._id == String(req.params._id));
            const itemBook = temp.find((el) => el._id == String(req.params._id));
            console.log(itemBook);
            const removed = temp.splice(indexBook, 1);
            const itemChange = {
                _id: itemBook._id,
                tenSach: itemBook.tenSach,
                khoSach: itemBook.khoSach,
                theLoai: itemBook.theLoai,
                tacGia: itemBook.tacGia,
                nxb: itemBook.nxb,
                phathanhthang: itemBook.phathanhthang,
                loaisach: itemBook.loaisach,
                urlImage: itemBook.urlImage,
                giaBia: itemBook.giaBia,
                amount: amount,
            };
            temp.splice(indexBook, 0, itemChange);
            for (let item of temp) {
                data.cart.push(item);
            }
            data.save();
            res.status(200).json({
                message: "Change successfully",
                success: true,
                status: 200,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "No products found",
                success: false,
                status: 500,
            });
        });
});

app.delete("/product/delete/:_id", checkToken, (req, res, next) => {
    AccountModel.findOne({ _id: req.user })
        .then((data) => {
            const temp = data.cart;
            data.cart = [];
            let indexBook = temp.findIndex((el) => el._id == req.params._id);
            const removed = temp.splice(indexBook, 1);
            for (let item of temp) {
                data.cart.push(item);
            }
            data.save();
            res.status(200).json({
                message: "Delete successfully",
                success: true,
                status: 200,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "No products found",
                success: false,
                status: 500,
            });
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});