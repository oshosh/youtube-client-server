const express = require("express");
let app = express();
const port = 5000;
// const bodyParser = require('body-parser')
const config = require("./config/key");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require('path');

const { User } = require("./models/User");
const { auth } = require("./middleware/auth")
// application/x-www-form-urlencoded
// name=kim&age=29 이런 형식들을 읽어 드린다.
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// application/json
app.use(express.json());
app.use(cookieParser());

mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("test call"));



app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));


app.listen(port, () => console.log(`current port ${port}`));
