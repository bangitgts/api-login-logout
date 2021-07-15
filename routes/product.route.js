// [ADD] Library
const express = require("express");
const router = express.Router();
const bookController = require("../app/controllers/BookController");
const checkToken = require("../auth/checkToken");

// [ROUTER](https://)
router.get("/", bookController.getBook);
router.get("/loai1", bookController.getLoai1);
router.get("/loai2", bookController.getLoai2);
router.get("/loai3", bookController.getLoai3);
router.get("/loai4", bookController.getLoai4);
router.get("/loai5", bookController.getLoai5);
router.get("/loai6", bookController.getLoai6);
router.get("/loai7", bookController.getLoai7);
router.get("/show/:_id", bookController.showProduct);
router.get("/cart", checkToken, bookController.cartUser);
router.put("/changepayment/:_id", checkToken, bookController.changePayment);
router.post("/payment", checkToken, bookController.paymentProduct);
router.post("/add/:_id", checkToken, bookController.addProduct);
router.put("/change/:_id", checkToken, bookController.changeAmount);
router.delete("/delete/:_id", checkToken, bookController.deleteProduct);
module.exports = router;