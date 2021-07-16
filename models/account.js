const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/CDTT", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const Schema = mongoose.Schema;
const AccountSchema = new Schema({
    name: String,
    email: String,
    password: String,
    imagePerson: String,
    address: String,
    phoneNumber: String,
    dateBirth: String,
    sex: Number,
    introduce: String,
    cart: Array,
    carted: Array,
    liked: Array,
    comment: Array, // comment obtains object
    isVerify: Number,
    resetToken: String,
    createDate: String,
}, {
    collection: "account",
});
const AccountModel = mongoose.model("account", AccountSchema);
module.exports = AccountModel;