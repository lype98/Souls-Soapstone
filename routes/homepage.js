const express = require('express');
const db = require('../database').db;
const router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

router.get('/', (req, res) => {
    // db.query('SELECT message,path,good,poor FROM ds3messages.soapstones', (error,results,fields) => {});
    res.render('homepage')  
});

module.exports = router