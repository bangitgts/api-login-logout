const AccountModel = require("../../models/account");
const BookModel = require("../../models/databook");

const jwt = require("jsonwebtoken");
const mailer = require("../../utils/mailer");
const multer = require("multer");
const md5 = require("md5");
let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        callback(null, "uploads");
    },
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            return callback(errorMess, null);
        }
        let filename = `${Date.now()}-bookstore-${file.originalname}`;
        callback(null, filename);
    },
});
let uploadFile = multer({ storage: diskStorage }).single("file");

function makeid(length) {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
class AccountController {
    // [GET] Information Account
    informationAccount(req, res) {
            AccountModel.findOne({
                    _id: req.user,
                })
                .then((data) => {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        data: {
                            _id: data._id,
                            name: data.name,
                            email: data.email,
                            address: data.address,
                            phoneNumber: data.phoneNumber,
                            dateBirth: data.dateBirth,
                            imagePerson: `http://45.77.12.16:4000/view/${data.imagePerson}`,
                            sex: data.sex,
                            cart: data.cart,
                            carted: data.carted,
                            isVerify: data.isVerify,
                            introduce: data.introduce,
                        },
                        message: "Login successfully",
                    });
                })
                .catch((err) => {
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: "Login failed",
                    });
                });
        }
        // [POST] Register Account
    registerAccount(req, res) {
            var abc = "default.png";
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
                            password: md5(password),
                            imagePerson: abc,
                            address: "",
                            phoneNumber: "",
                            dateBirth: "",
                            sex: null,
                            introduce: "",
                            cart: [],
                            carted: [], // hang da thanh toan add vo day
                            liked: [],
                            comment: [],
                            isVerify: 0,
                            resetToken: null,
                            createDate: new Date().toLocaleDateString(),
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
                .catch((err) => res.status(500).json("Server Error 500"));
        }
        // [POST] Login Account and Get Token
    loginAccount(req, res) {
            let email = req.body.email;
            let password = req.body.password;
            let md5Password = md5(password);
            AccountModel.findOne({
                    email: email,
                    password: md5Password,
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
                                password: md5(password),
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
        }
        // [PUT] Change Password
    changePassword(req, res) {
            let password = req.body.password;
            let newPassword = req.body.newPassword;
            let md5newPassword = md5(newPassword);
            AccountModel.findOne({
                    _id: req.user,
                    password: md5(password),
                })
                .then((data) => {
                    if (data) {
                        data.password = md5newPassword;
                        data.save();
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Change password successfully",
                        });
                    } else {
                        res.status(402).json({
                            status: 402,
                            success: false,
                            message: "Old password entered is incorrect",
                        });
                    }
                })
                .catch((err) => {
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: "Login failed",
                    });
                });
        }
        // [PUT] Change Information
    changeInformation(req, res) {
            let name = req.body.name;
            let address = req.body.address;
            let phoneNumber = req.body.phoneNumber;
            let dateBirth = req.body.dateBirth;
            let sex = req.body.sex; // nu la 0, nam la 1
            let introduce = req.body.introduce;
            AccountModel.findOne({
                    _id: req.user,
                })
                .then((data) => {
                    if (address && phoneNumber && dateBirth && sex && introduce) {
                        data.name = name;
                        data.address = address;
                        data.phoneNumber = phoneNumber;
                        data.dateBirth = dateBirth;
                        data.sex = sex;
                        data.introduce = introduce;
                        data.save();
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Change successfully",
                        });
                    } else {
                        res.status(402).json({
                            status: 402,
                            success: false,
                            message: "You are not enough information",
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: "Login Failed",
                    });
                });
        }
        // [POST] Forgot Password
    forgotPassword(req, res) {
            const email = req.body.email;
            AccountModel.findOne({ email: email })
                .then((data) => {
                    const c = makeid(6);
                    data.resetToken = c;
                    const sub = "Reset Password - Chuyên đề thực tế 2";
                    const htmlContent = `<h3>Mã xác nhận của quý khách là ${c} </h3>`;
                    mailer.sendMail(req.body.email, sub, htmlContent);
                    data.save();
                    res.status(200).json({
                        message: "Your email has been sent successfully",
                        success: true,
                        status: 200,
                    });
                })
                .catch((err) => {
                    res.status(402).json({
                        message: "Can't search email",
                        success: false,
                        status: 402,
                    });
                });
        }
        // [PUT] New Password After forgotPassword
    newPassword(req, res) {
            const email = req.params.email;
            const newPassword = req.body.newPassword;
            const md5newPassword = md5(newPassword);
            const token = req.body.token;
            AccountModel.findOne({ email: email, resetToken: token })
                .then((data) => {
                    if (data === null) {
                        res.status(402).json({
                            message: "Token không hợp lệ",
                            success: false,
                            status: 402,
                        });
                    } else {
                        data.password = md5newPassword;
                        data.resetToken = null;
                        data.save();
                        res.status(200).json({
                            message: "Change password successfully",
                            success: true,
                            status: 200,
                        });
                    }
                })
                .catch((err) => {
                    res.status(402).json({
                        message: "Invalid token ",
                        success: false,
                        status: 402,
                    });
                });
        }
        // [POST] Upload avatar
    uploadImage(req, res) {
            uploadFile(req, res, (error) => {
                // Nếu có lỗi thì trả về lỗi cho client.
                if (error) {
                    return res.status(402).json({
                        status: 402,
                        success: false,
                        message: "File type must be png or jpeg",
                    });
                }
                AccountModel.findOne({
                        _id: req.user,
                    })
                    .then((data) => {
                        data.imagePerson = req.file.filename;
                        data.save();
                        res.status(200).json({
                            status: 200,
                            success: true,
                            message: "Change avatar successfully",
                        });
                    })
                    .catch((err) => {
                        res.status(400).json({
                            status: 400,
                            success: false,
                            message: "Login Failed",
                        });
                    });
            });
        }
        // [POST] Send Mail Verify Email
    sendMailVerifyEmail(req, res) {
            const _id = req.user._id;
            AccountModel.findOne({ _id: _id })
                .then((data) => {
                    if (data.isVerify !== 1) {
                        const generateId = makeid(6);
                        data.isVerify = generateId;
                        const sub = "Verify Account - Book Store";
                        const htmlContent = `<h3>Your verification code ${generateId} </h3>`;
                        mailer.sendMail(data.email, sub, htmlContent);
                        data.save();
                        res.status(200).json({
                            message: "Your email has been sent successfully",
                            success: true,
                            status: 200,
                        });
                    } else {
                        res.status(405).json({
                            message: "Account has been verifyeded",
                            success: false,
                            status: 405,
                        });
                    }
                })
                .catch((err) => {
                    res.status(500).json({
                        message: "Your email has been sent failed because server error",
                        success: false,
                        status: 500,
                    });
                });
        }
        // [PUT] Verify Email
    verifyAccount(req, res) {
        const _id = req.user._id;
        const verification = req.body.verification;
        AccountModel.findOne({ _id: _id }).then((data) => {
            if (data.isVerify === 1) {
                res.status(405).json({
                    message: "Account has been verifyded",
                    success: false,
                    status: 405,
                });
            } else {
                if (data.isVerify === verification) {
                    data.isVerify = 1;
                    data.save();
                    res.status(202).json({
                        message: "Congratulations!!! The account has been verified",
                        success: true,
                        status: 202,
                    });
                } else {
                    res.status(405).json({
                        message: "Verification code does not match",
                        success: false,
                        status: 405,
                    });
                }
            }
        });
    }
    likeBook(req, res) {
        const idBook = req.body.idBook;
        const idUser = req.user._id;
        BookModel.findOne({ _id: idBook }).then((data) => {
            const boolLike = data.like.find((el) => el._id == idUser);
            if (boolLike !== undefined) {
                res.status(405).json({
                    message: "This person liked the book",
                    success: false,
                    status: 405,
                });
            } else {
                AccountModel.findOne({ _id: idUser }).then((account) => {
                    const itemAccount = {
                        _id: account._id,
                        email: account.email,
                    };
                    data.like.push(itemAccount);
                    const itemBook = {
                        _id: data._id,
                        tenSach: data.tenSach,
                    };
                    account.liked.push(itemBook);
                    data.save();
                    account.save();
                });
                res.status(200).json({
                    message: "Successfully like book",
                    success: true,
                    status: 200,
                });
            }
        });
    }
    dislikeBook(req, res) {
        function removeItemOnce(arr, value) {
            var index = arr.indexOf(value);
            if (index > -1) {
                arr.splice(index, 1);
            }
            return arr;
        }
        const idBook = req.body.idBook;
        const idUser = req.user._id;
        BookModel.findOne({ _id: idBook }).then((data) => {
            const boolLike = data.like.find((el) => el._id == idUser);
            if (boolLike === undefined) {
                res.status(405).json({
                    message: "This person didn't like the book",
                    success: false,
                    status: 405,
                });
            } else {
                AccountModel.findOne({ _id: idUser }).then((account) => {
                    const boolAccount = account.liked.find((el) => el._id == idBook);
                    removeItemOnce(data.like, boolLike);
                    removeItemOnce(account.liked, boolAccount);
                    data.save();
                    account.save();
                });
                res.status(200).json({
                    message: "This person disliked the book",
                    success: true,
                    status: 200,
                });
            }
        });
    }
}

module.exports = new AccountController();