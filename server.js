const express = require("express");
const app = express();
const port = 3001;
var morgan = require("morgan");
const bodyParser = require("body-parser");
const AccountModel = require("./models/account");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
const checkToken = require("./auth/checkToken");
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", checkToken, (req, res, next) => {
  AccountModel.findOne({ username: req.body.username,
    password: req.body.password
  })
  .then((data) => {
    res.json(data)
  })
  .catch(err=>console.log(err))
  // let checknew = {
  //   username: req.body.username,
  //   password: req.body.password,
  //   haihang: "abc"
  // }
  // res.json(checknew);

});

app.post("/register", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  AccountModel.findOne({ username: username })
    .then((data) => {
      if (data) {
        res.json("User này đã tồn tại");
      } else {
        AccountModel.create({
          username: username,
          password: password,
        });
      }
    })
    .then((data) => res.json("Tạo Tài Khoản Thành Công"))
    .catch((err) => res.status(500).json("Thất bại "));
});
app.post("/login", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  AccountModel.findOne({
    username: username,
    password: password,
  })
    .then((data) => {
      if (data) {
        let token = jwt.sign(
          {
            _id: data._id,
          },
          "password"
        );
        res.header("auth-token", token).send(token);
        res.json({
          message: "Logged  successfully",
          token: token,
        });
      } else {
        return res.json("Tai khoan hoac mat khau sai");
      }
    })
    .catch((err) => res.status(500).json("Có lỗi sever"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
