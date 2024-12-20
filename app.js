const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes/index');
const app = express();

require('dotenv').config();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); // 이게 있어야 req.body를 객체로 사용할 수 있음
// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
//     next();
//   });
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use('/api',indexRouter);
// /ap
const mongoURI = process.env.DB_ADDRESS;
mongoose.connect(mongoURI, {useNewUrlParser:true}).then(( )=> console.log('MongoDB Connected')).catch((err) => console.log("db connection fail",err));

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
})
