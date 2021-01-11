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

router.post('/test', async(req, res)=> {
    const soapstone = req.body;
    // query db, check if there is already another message that's the same. if there is, ask user if they want to visit the link, else, check path
    await db.query('SELECT message,path FROM ds3messages.soapstones', (error,results,fields) => {
        if (error) throw error;
        for (result of results) {            
            if(result.message == soapstone.message) { /* IMPORTANT, change this console log to a redirect prompt in the front end to /ds3/result.path */
                console.log(`this message already exists! path: ${result.path}`);
            }
          }
    });
    //query db, check path, if there's already another one, reroll a few more random ones and check again
    //if all successfull, redirect to new page with the submitted message
    console.log(soapstone);    
    return res.end()
});


module.exports = router