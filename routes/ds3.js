const express = require('express');
const db = require('../database').db;
const router = express.Router();
var bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: false}))
router.use(bodyParser.json())

let allMessages = [[],[],{
    creatures: [],
    objects: [],
    techniques: [],
    actions: [],
    geography: [],
    orientation: [],
    bodyparts: [],
    attribute: [],    
    concepts: [],    
    musings: [] }];   

router.get('/', (req, res) => {    
    const queryWrite = async()=> {
        await db.query("SELECT type FROM ds3messages.templates", (error,results,fields) => {
            if (error) throw error;
            if(allMessages[0].length <= 0){
                for (obj of results) { // get all the templates and put in allMessages index 0 array
                    const val = Object.values(obj);
                    allMessages[0].push(val[0]);
                };
            };
        });
        await db.query("SELECT type FROM ds3messages.conjunctions", (error,results,fields) => {
            if (error) throw error;
            if(allMessages[1].length <= 0){
                for (obj of results) { // get all the conjunctions and put in allMessages index 1 array
                    const val = Object.values(obj);
                    allMessages[1].push(val[0]);
                };
            };
        });
        await db.query("SELECT word,type FROM ds3messages.words", (error,results,fields) => {
            if (error) throw error;
            if(allMessages[2].actions.length <= 0){
                const wordArray = results;
                wordArray.map((obj)=>{            
                    if (obj.type == 1) allMessages[2].creatures.push(obj.word);                   
                    if (obj.type == 2) allMessages[2].objects.push(obj.word);                   
                    if (obj.type == 3) allMessages[2].techniques.push(obj.word);                   
                    if (obj.type == 4) allMessages[2].actions.push(obj.word);                   
                    if (obj.type == 5) allMessages[2].geography.push(obj.word);                   
                    if (obj.type == 6) allMessages[2].orientation.push(obj.word);                   
                    if (obj.type == 7) allMessages[2].bodyparts.push(obj.word);                   
                    if (obj.type == 8) allMessages[2].attribute.push(obj.word);                   
                    if (obj.type == 9) allMessages[2].concepts.push(obj.word);                   
                    if (obj.type == 10) allMessages[2].musings.push(obj.word);                   
                });                
            };
            res.render('ds3', {ds3messages: allMessages})              
        });        
    }; queryWrite()
});

router.get('/:path', async(req, res) => { // page that will load just the template from the DB
    let soapstone = {
        message: '',
        good: '',
        bad: '',
    }
    await db.query('SELECT message,path,good,bad FROM ds3messages.soapstones', (error,results,fields) => {        
        let current = 0;
        for(result of results) {
            current++
            if(result.path === parseInt(req.params.path)) { // if path exists in DB, fill soapstone object and render template page
                soapstone.message = result.message;
                soapstone.good = result.good;
                soapstone.bad = result.bad;
                console.log(soapstone);
                return res.render('ds3-template', {soapstone: soapstone})
            }
            if(current >= results.length) {
                res.status(404).send("Error 404 - This message path doesn't exist") // if loop ends without finding anything, send 404
            }            
        }
    });
});



router.post('/test', async(req, res)=> {
    const soapstone = req.body;
    // query db, check if there is already another message that's the same. if there is, ask user if they want to visit the link, else, check path
    await db.query('SELECT message,path FROM ds3messages.soapstones', (error,results,fields) => {
        if (error) throw error;
        const sendToDB = ()=> { // function to send the soapstone to the DB            
            db.query(`INSERT INTO ds3messages.soapstones (message,path) VALUES ("${soapstone.message}","${soapstone.path}");`, (error,results,fields) => {
                if (error) throw error;
            });
            // console.log(`INSERT INTO ds3messages.soapstones (message,path) VALUES ('${soapstone.message}','${soapstone.path}');`);
        };
        for (result of results) {            
            if(result.message == soapstone.message) { /* IMPORTANT, change this console log to a redirect prompt in the front end to /ds3/result.path */
                console.log(`this message already exists! path: ${result.path}`);
            }
            if(result.path == soapstone.path){ // if soapstone path exists in DB, create 10 paths, try them until it sends the updated soapstone
                const array = new Array(10).fill(0);
                const potentialPaths = array.map(path => path + Math.floor(Math.random() * 99999));
                for (potentialPath of potentialPaths) {
                    if(potentialPath !== result.path){                        
                        soapstone.path = potentialPath;
                        return sendToDB();
                    };
                };
            }            
            else{
                return sendToDB(); // IMPORTANT BUG: CLICKING SUBMIT AFTER THE 1ST CLICK SENDS DUPLICATE TO DB. I NEED TO REDIRECT TO THE NEW TEMPLATE WEBSITE
            }
          };
    });
    //query db, check path, if there's already another one, reroll a few more random ones and check again
    //if all successfull, redirect to new page with the submitted message
    console.log(soapstone);    
    return res.end()
});


module.exports = router