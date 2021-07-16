const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/CDTT", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const Schema = mongoose.Schema;
const BookSchema = new Schema({
    tenSach: String,
    tacGia: String,
    phathanhthang: String,
    nxb: String,
    khoSach: String,
    theLoai: String,
    loaisach: String,
    urlImage: String,
    giaBia: String,
    giaGiam: Number,
    moTa: String,
    like: Array,
    comment: Array,
    voucher: Array,
    soLuongtrongkho: Number,
    soLuongdaban: Array,
}, {
    collection: "bookstore",
});
const BookModel = mongoose.model("bookstore", BookSchema);
module.exports = BookModel;