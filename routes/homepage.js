const express = require('express');
const db = require('../database').db;
const router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

let soapstones = [];

router.get('/', (req, res) => {
    const queryWrite = async()=> {        
        await db.query(`SELECT message,path,good,poor,creation_time FROM soapstones ORDER BY creation_time DESC LIMIT 0, 12;`, (error,results,fields) => {
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
    if (Number.isInteger(req.body.id) == false) return res.status(404).send();
    req.body.id++; // increment current page then query, then send it    
    db.query(`SELECT message,path,good,poor,creation_time FROM soapstones ORDER BY creation_time DESC LIMIT ${req.body.id*12}, 12;`, (error,results,fields) => {        
        if (error) console.error(error);
        res.json(results);
    })
})

router.post('/left_arrow', (req, res)=> {
    if (Number.isInteger(req.body.id) == false) return res.status(404).send();
    req.body.id--;    
    db.query(`SELECT message,path,good,poor,creation_time FROM soapstones ORDER BY creation_time DESC LIMIT ${req.body.id*12}, 12;`, (error,results,fields) => {        
        if (error) console.error(error);
        res.json(results);
    })
})

router.post('/search_bar', (req, res)=> {
    const format = /[@#$%^&*()_+\-=\[\]{};':"\\|<>\/]+/;
    let search = req.body.query;
    if(format.test(search)){        
        console.error(`illegal symbol in search: ${search}`);
        return res.status(404).send("illegal symbol in search");
      } else {
        db.query(`SELECT message,path,good,poor,creation_time FROM soapstones where message REGEXP "\\\\${search}";`, (error,results,fields) => {        
            if (error) console.error(error);        
            res.json(results);
        });
      };
})

module.exports = router