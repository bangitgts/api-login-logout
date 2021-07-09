const AccountModel = require("../../models/account");
const jwt = require("jsonwebtoken");
const mailer = require("../../utils/mailer");
const multer = require("multer");
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
                            password: password,
                            imagePerson: abc,
                            address: "",
                            phoneNumber: "",
                            dateBirth: "",
                            sex: null,
                            introduce: "",
                            cart: [],
                            carted: [], // hang da thanh toan add vo day
                            resetToken: null,
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
                .catch((err) => res.status(500).json("Server Error 500"));
        }
        // [POST] Login Account and Get Token
    loginAccount(req, res) {
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
        }
        // [PUT] Change Password
    changePassword(req, res) {
            let password = req.body.password;
            let newPassword = req.body.newPassword;
            AccountModel.findOne({
                    _id: req.user,
                    password: password,
                })
                .then((data) => {
                    if (data) {
                        data.password = newPassword;
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
                        data.password = newPassword;
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
}

module.exports = new AccountController();