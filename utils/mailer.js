const nodeMailer = require('nodemailer')
const mailHost = 'smtp.gmail.com'
const mailPort = 587
var person = require('../account')

const sendMail = (to, subject, htmlContent) => {
    const transporter = nodeMailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
            user: person.email,
            pass: person.password
        }
    })

    const options = {
        from: "bangitgts@gmail.com", // địa chỉ admin email bạn dùng để gửi
        to: to, // địa chỉ gửi đến
        subject: subject, // Tiêu đề của mail
        html: htmlContent // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
    }

    // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
    return transporter.sendMail(options)
}

module.exports = {
    sendMail: sendMail
}