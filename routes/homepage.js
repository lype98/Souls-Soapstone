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

// router.post('/ajax', (req, res)=> {
//     console.log(req.body)
//     db.query('SELECT path FROM ds3messages.soapstones', (error,results,fields) => {
//         console.log(results[1])
//         res.json(results[1])
//     })
// })

module.exports = router