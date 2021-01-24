const express = require('express');
const db = require('../database').db;
const router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

let soapstones = [];

router.get('/', (req, res) => {
    const queryWrite = async()=> {
        await db.query("SELECT message,path,good,poor,creation_time FROM ds3messages.soapstones ORDER BY creation_time DESC;", (error,results,fields) => {
            if (error) throw error;
            soapstones = [];
            for(result of results) {
                soapstones.push(result);
            };        
            res.render('homepage', {soapstones});
        });        
    }; queryWrite()
});

module.exports = router