const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CDTT', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const Schema = mongoose.Schema;
const BookSchema = new Schema({
    id: String,
    tenSach: String,
    khoSach: String,
    theloai: String,
    tacGia: String,
    nxb: String,
    phathanhthang: String,
    loaisach: String,
    urlImage: String,
    giaBia: String,
    moTa: String
}, {
    collection: 'bookstore'
});
const BookModel = mongoose.model('bookstore', BookSchema);
module.exports = BookModel;