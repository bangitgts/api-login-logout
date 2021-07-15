const AccountModel = require("../../models/account");
const BookModel = require("../../models/databook");
class BookController {
    // [GET] Data Book
    getBook(req, res) {
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
                        message: "Failed",
                        success: false,
                        status: 401,
                    });
                });
        }
        // [GET] Data Book Loai 1
    getLoai1(req, res) {
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
                        message: "Failed",
                        success: false,
                        status: 401,
                    });
                });
        }
        // [GET] Data Book Loai 2
    getLoai2(req, res) {
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
        }
        // [GET] Data Book Loai 3
    getLoai3(req, res) {
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
        }
        // [GET] Data Book Loai 4
    getLoai4(req, res) {
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
        }
        // [GET] DataBook Loai 5
    getLoai5(req, res) {
            BookModel.find({ loaisach: "loai5" })
                .then((data) => {
                    return res.status(200).json({
                        message: "BookStore loai 5",
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
        }
        // [GET] DataBook Loai 6
    getLoai6(req, res) {
            BookModel.find({ loaisach: "loai6" })
                .then((data) => {
                    return res.status(200).json({
                        message: "BookStore loai 6",
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
        }
        // [GET] DataBook Loai 7

    getLoai7(req, res) {
            BookModel.find({ loaisach: "loai7" })
                .then((data) => {
                    return res.status(200).json({
                        message: "BookStore loai 7",
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
        }
        // [GET] Get Book params _id
    showProduct(req, res) {
            BookModel.findOne({ _id: req.params._id })
                .then((data) => {
                    console.log(typeof data);
                    return res.status(200).json({
                        message: "Information Book",
                        success: true,
                        status: 200,
                        data: data,
                    });
                })
                .catch((err) => {
                    return res.status(401).json({
                        message: "No product found",
                        success: false,
                        status: 401,
                    });
                });
        }
        // [GET] Cart user => checktoken
    cartUser(req, res) {
            AccountModel.findOne({
                _id: req.user,
            })

            .then((data) => {
                    const b = data.cart.filter((el) => el.isStatus === "1");
                    res.status(200).json({
                        status: 200,
                        success: true,
                        email: data.email,
                        tongMathang: String(data.cart.length),
                        tongSanpham: b !== null ?
                            String(
                                data.cart.reduce(function(total, currentValue) {
                                    return total + parseInt(currentValue.amount);
                                }, 0)
                            ) :
                            "0",
                        tongMathangthanhtoan: b.length > 0 ? String(b.length) : "0",
                        tongSanphamthanhtoan: b !== null ?
                            String(
                                b.reduce(function(total, currentValue) {
                                    return total + parseInt(currentValue.amount);
                                }, 0)
                            ) :
                            "0",
                        tongTienthanhtoan: b.length > 0 ?
                            String(
                                b.reduce(function(total, currentValue) {
                                    return (
                                        total +
                                        parseInt(currentValue.amount) *
                                        parseInt(currentValue.giaBia)
                                    );
                                }, 0)
                            ) :
                            "0",
                        cart: data.cart,
                        carted: data.carted,
                        message: "Cart Data",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: err,
                    });
                });
        }
        // [PUT] Change Payment params _id
    changePayment(req, res) {
            AccountModel.findOne({
                _id: req.user,
            })

            .then((data) => {
                    const temp = data.cart;
                    data.cart = [];
                    let indexBook = temp.findIndex(
                        (el) => el._id == String(req.params._id)
                    );
                    const itemBook = temp.find((el) => el._id == String(req.params._id));
                    const removed = temp.splice(indexBook, 1);
                    //            console.log(itemBook);
                    const itemChange = {
                        _id: itemBook._id,
                        tenSach: itemBook.tenSach,
                        khoSach: itemBook.khoSach,
                        theLoai: itemBook.theLoai,
                        tacGia: itemBook.tacGia,
                        nxb: itemBook.nxb,
                        phathanhthang: itemBook.phathanhthang,
                        loaisach: itemBook.loaisach,
                        isStatus: itemBook.isStatus === "1" ? "0" : "1",
                        urlImage: itemBook.urlImage,
                        giaBia: itemBook.giaBia,
                        amount: itemBook.amount,
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
                    console.log(err);
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: "No product found in the cart",
                    });
                });
        }
        // [POST] Payment Product
    paymentProduct(req, res) {
            AccountModel.findOne({
                    _id: req.user,
                })
                .then((data) => {
                    const temp = data.carted;
                    const Paymented = data.cart.filter((el) => el.isStatus === "1");
                    const willPayment = data.cart.filter((el) => el.isStatus === "0");
                    data.cart = willPayment;
                    if (Paymented.length === 0) {
                        res.status(403).json({
                            message: "No products to pay for",
                            success: true,
                            status: 403,
                        });
                    } else {
                        for (let item of Paymented) {
                            let itemAdd = {
                                _id: item._id,
                                tenSach: item.tenSach,
                                khoSach: item.khoSach,
                                theLoai: item.theLoai,
                                tacGia: item.tacGia,
                                nxb: item.nxb,
                                phathanhthang: item.phathanhthang,
                                loaisach: item.loaisach,
                                isStatus: item.isStatus,
                                urlImage: item.urlImage,
                                giaBia: item.giaBia,
                                amount: item.amount,
                                datePayment: new Date(),
                            };
                            temp.push(itemAdd);
                        }
                        data.carted = temp;
                        data.save();
                        res.status(200).json({
                            message: "Payment successfully",
                            success: true,
                            status: 200,
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(400).json({
                        status: 400,
                        success: false,
                        message: "Payment Failed",
                    });
                });
        }
        // [POST] Add Product in cart User
    addProduct(req, res) {
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
                        isStatus: "0",
                        urlImage: data.urlImage,
                        giaBia: data.giaBia,
                        amount: amount,
                    };

                    AccountModel.findOne({ _id: req.user }).then((data) => {
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
                            const totalAmount =
                                parseInt(item.amount) + parseInt(boolBook.amount);
                            const itemChange = {
                                _id: item._id,
                                tenSach: item.tenSach,
                                khoSach: item.khoSach,
                                theLoai: item.theLoai,
                                tacGia: item.tacGia,
                                nxb: item.nxb,
                                phathanhthang: item.phathanhthang,
                                loaisach: item.loaisach,
                                isStatus: "0",
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
                        message: "Add successfuly",
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
        }
        // [PUT] Change amount product
    changeAmount(req, res) {
            const amount = req.body.amount;
            AccountModel.findOne({ _id: req.user })
                .then((data) => {
                    const temp = data.cart;
                    data.cart = [];
                    let indexBook = temp.findIndex(
                        (el) => el._id == String(req.params._id)
                    );
                    const itemBook = temp.find((el) => el._id == String(req.params._id));
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
                        isStatus: itemBook.isStatus,
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
        }
        // [DELETE] Delete Product in Cart
    deleteProduct(req, res) {
        AccountModel.findOne({ _id: req.user })
            .then((data) => {
                const temp = data.cart;
                data.cart = [];
                let indexBook = temp.findIndex((el) => el._id == req.params._id);
                if (indexBook === -1) {
                    res.status(402).json({
                        message: "No products found in the cart",
                        success: false,
                        status: 402,
                    });
                } else {
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
                }
            })
            .catch((err) => {
                res.status(402).json({
                    message: "No products found in the cart",
                    success: false,
                    status: 402,
                });
            });
    }
}

module.exports = new BookController();