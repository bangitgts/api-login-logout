const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/CDTT', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const Schema = mongoose.Schema;
const AccountSchema = new Schema({
    username: String,
    password: String,
    cart: []
}, {
    collection: 'account'
});
const AccountModel = mongoose.model('account', AccountSchema);
module.exports = AccountModel;