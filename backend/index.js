const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require("path");

const userQuery = require('./js/userQuery');
const productQuery = require('./js/productQuery');
const sendMail = require('./js/sendMail');

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static("../client-web/public"));
const storage = multer.diskStorage({
    destination: "../client-web/public/uploadImages",
    filename: function(req, file, cb) {
        cb(null, "imgfile" + Date.now() + path.extname(file.originalname))
    }
});

app.get('/', (req, res) => {

})

// app.get('/user', async (req, res) => {
//     try {
//         const resultRow = await userQuery.selectUserById(req.query.id);
//         res.status('200').json(resultRow[0]).end();
//     } catch (err) {
//         console.log(err);
//         res.status('400').json(err).end();
//     }
// })

app.post('/login/google', async (req, res) => {
    try {
        let resultRow;
        const result = await userQuery.isUserExist(req.body.userId);
        if (result === false) 
            resultRow = await userQuery.insertUser(req.body);
        else
            resultRow = result;
        res.status('200').json(resultRow).end();
    } catch (err) {
        console.log(err);
        res.status('400').json(err).end();
    }
    
})

app.post('/editinfo', async (req, res) => {
    try {
        await userQuery.editUserValue(req.body);
        const resultRow = await userQuery.selectUserById(req.body.id);
        res.status('200').json(resultRow[0]).end();
    } catch (err) {
        console.log(err);
        res.status('400').json(err).end();
    }
})

app.get('/univ', async (req, res) => {
    try {
        const resultRow = await userQuery.selectUniv(req.query.id);
        res.status('200').json(resultRow[0]).end();
    } catch (err) {
        console.log(err);
        res.status('400').json(err).end();
    }
})

app.get('/univs', async (req, res) => {
    try {
        const resultRow = await userQuery.selectUnivs();
        res.status('200').json(resultRow).end();
    } catch (err) {
        console.log(err);
        res.status('400').json(err).end();
    }
})

app.post('/mail', async (req, res) => {
    try {
        const authNum = await sendMail(req);
        res.status('200').json({authCode: authNum}).end();
    } catch(err) {
        console.log(err);
        res.status('400').json(err).end();
    }
})

app.post('/product', async (req, res) => {
    try {
        console.log(req.body);
        console.log("formData:", req.body);
        const resultRow = await productQuery.insertProduct(req.body);
        console.log("in index.js result:", resultRow);
        res.status('200').json(resultRow).end();
    } catch (err) {
        console.log(err);
        res.status('400').json(err).end();
    }
})

const upload = multer({storage: storage, limits: {fileSize: 100000000000}});

app.post('/uploadImage', upload.single('image'), (req, res, next) => {
    console.log(req.file)
    res.send({
        fileName: req.file.filename
    })
})

app.listen(3001, () => {
    console.log('Server is working on 3001');
})