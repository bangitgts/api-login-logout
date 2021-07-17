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
router.put(
    "/changeinformation",
    checkToken,
    accountController.changeInformation
);
// [POST] Forgot Password
router.post("/forgotpassword", accountController.forgotPassword);
// [PUT] New Password after forgotPassword
router.put("/newpassword/:email", accountController.newPassword);
// [POST] Upload Avatar
router.post("/uploadavatar", checkToken, accountController.uploadImage);
// [POST] Send Email Verify Account Email
router.post(
    "/sendemailverifyaccount",
    checkToken,
    accountController.sendMailVerifyEmail
);
// [PUT] Change isVerify Account Email
router.put("/verifyaccount", checkToken, accountController.verifyAccount);
// [POST] Like book
router.post("/likebook", checkToken, accountController.likeBook);
// [POST] Disliked
router.post("/dislikebook", checkToken, accountController.dislikeBook);
// [POST] Comment
router.post("/comentbook", checkToken, accountController.dislikeBook);

// [POST] Comments
module.exports = router;