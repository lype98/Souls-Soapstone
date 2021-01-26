const express = require('express');
const db = require('../database').db;
const router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

let soapstones = [];

router.get('/', (req, res) => {
    const queryWrite = async()=> {
        // await db.query("SELECT message,path,good,poor,creation_time FROM ds3messages.soapstones ORDER BY creation_time DESC;", (error,results,fields) => {
        await db.query("SELECT message,path,good,poor,creation_time FROM ds3messages.soapstones ORDER BY creation_time DESC LIMIT 0, 12;", (error,results,fields) => {
            if (error) throw error;
            soapstones = [];
            for(result of results) {
                soapstones.push(result);
            };        
            res.render('homepage', {soapstones});
        });        
    }; queryWrite()
});

router.post('/right_arrow', (req, res)=> { // clicking right arrow sends next page's templates
    req.body.id++; // increment current page then query, then send it
    // console.log(`page: ${req.body.id}`)
    db.query(`SELECT message,path,good,poor,creation_time FROM ds3messages.soapstones ORDER BY creation_time DESC LIMIT ${req.body.id*12}, 12;`, (error,results,fields) => {        
        if (error) throw error;
        res.json(results)
    })
})

router.post('/left_arrow', (req, res)=> {
    req.body.id--;
    // console.log(`page: ${req.body.id}`)
    db.query(`SELECT message,path,good,poor,creation_time FROM ds3messages.soapstones ORDER BY creation_time DESC LIMIT ${req.body.id*12}, 12;`, (error,results,fields) => {        
        if (error) throw error;
        res.json(results)
    })
})

router.post('/search_bar', (req, res)=> {
    let search = req.body.query;    
    db.query(`SELECT message,path,good,poor,creation_time FROM ds3messages.soapstones where message REGEXP "${search}";`, (error,results,fields) => {        
        if (error) throw error;
        console.log(results)
        res.json(results)
    })
})

module.exports = router