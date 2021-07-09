const express = require("express");
const router = express.Router();
const checkToken = require("../auth/checkToken");
const accountController = require("../app/controllers/AccountController");
// [GET] Information Account
router.get("/", checkToken, accountController.informationAccount);
// [POST] Register Account
router.post("/register", accountController.registerAccount);
// [POST] Login Account
router.post("/login", accountController.loginAccount);
// [PUT] Change Password
router.put("/changepassword", checkToken, accountController.changePassword);
// [PUT] Change Information
router.put("/changeinformation", checkToken, accountController.changeInformation);
// [POST] Forgot Password
router.post("/forgotpassword", accountController.forgotPassword);
// [PUT] New Password after forgotPassword
router.put("/newpassword/:email", accountController.newPassword);
// [POST] Upload Avatar
router.post("/uploadavatar", checkToken, accountController.uploadImage)
module.exports = router;