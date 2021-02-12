const express = require('express');
const db = require('../database').db;
const router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

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
        await db.query(`SELECT type FROM templates`, (error,results,fields) => {
            if (error) throw error;
            if(allMessages[0].length <= 0){
                for (obj of results) { // get all the templates and put in allMessages index 0 array
                    const val = Object.values(obj);
                    allMessages[0].push(val[0]);
                };
            };
        });
        await db.query(`SELECT type FROM conjunctions`, (error,results,fields) => {
            if (error) throw error;
            if(allMessages[1].length <= 0){
                for (obj of results) { // get all the conjunctions and put in allMessages index 1 array
                    const val = Object.values(obj);
                    allMessages[1].push(val[0]);
                };
            };
        });
        await db.query(`SELECT word,type FROM words`, (error,results,fields) => {
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
        path: '',
        good: '',
        poor: '',
    }
    await db.query(`SELECT message,path,good,poor FROM soapstones`, (error,results,fields) => {        
        let current = 0;
        for(result of results) {
            current++
            if(result.path === parseInt(req.params.path)) { // if path exists in DB, fill soapstone object and render template page
                soapstone.message = result.message;
                soapstone.path = result.path;
                soapstone.good = result.good;
                soapstone.poor = result.poor;
                console.log(`user visited: `,soapstone);
                return res.render('ds3-template', {soapstone: soapstone})
            }
            if(current >= results.length) {
                res.status(404).send("Error 404 - This message path doesn't exist") // if loop ends without finding anything, send 404
            }            
        }
    });
});

router.post('/submitted_soapstone', async(req, res)=> {
    const soapstone = req.body;
    let soapstonePath = Math.floor(Math.random() * 99999); // create a random path number for a URL
    // query db, check if there is a repeated message. if there is, ask user if they want to visit the link, else, check path
    await db.query(`SELECT message,path FROM soapstones`, (error,results,fields) => {
        if (error) throw error;

        const sendToDB = ()=> { // function to send the soapstone to the DB            
            db.query(`INSERT INTO soapstones (message,path) VALUES ("${soapstone.message}","${soapstonePath}");`, (error,results,fields) => {
                if (error) throw error;
            });
            let soapstoneSent = {
                pathSent: soapstonePath,
                messageSent: soapstone.message
            };
            res.json(soapstoneSent);                
        };

        let current = 0;
        for (result of results) {
            current++                      
            if(result.message === soapstone.message) { // if DB result matches the soapstone sent from the front-end send soapstone back to front end
                let soapstoneExists = {
                    pathExists: result.path,
                    messageExists: result.message}
                console.log(`${soapstoneExists.messageExists} already exists! path: ${soapstoneExists.pathExists}`);                
                return res.json(soapstoneExists);
            }
            if(result.path == soapstonePath){ // if soapstone path exists in DB, create 10 paths, try them until it sends the updated soapstone
                const array = new Array(10).fill(0);
                const potentialPaths = array.map(path => path + Math.floor(Math.random() * 99999));
                for (potentialPath of potentialPaths) {
                    if(potentialPath !== result.path){                        
                        soapstonePath = potentialPath;
                        return sendToDB(); //console.log('message sent to DB')
                    };
                };
            }            
            if(current >= results.length){
                return sendToDB(); //console.log('message sent to DB')
            }
          };
    });
});

router.post('/appraised', (req, res)=> {
    const vote = req.body;
    if(vote.appraise == true && vote.path.toString().length <= 5 && Number.isInteger(vote.path)) {        
        db.query(`UPDATE soapstones SET good = good + 1 WHERE (path = "${vote.path}");`, (error,results,fields) => {            
            if(results.changedRows == 1) {
                console.log(`Message with path ${vote.path} was appraised!`); // change later so it shows the message again, using the decoder I'll make
                res.status(200).send("ok");
            }
            if(error) console.error(error);
        })
    };
});

router.post('/disparged', (req, res)=> {
    const vote = req.body;
    if(vote.disparge == true && vote.path.toString().length <= 5 && Number.isInteger(vote.path)) {       
        db.query(`UPDATE soapstones SET poor = poor + 1 WHERE (path = "${vote.path}");`, (error,results,fields) => {
            if(results.changedRows == 1) {
                console.log(`Message with path ${vote.path} was disparged!`); // change later so it shows the message again, using the decoder I'll make
                res.status(200).send("ok");
            }             
            if(error) console.error(error);
        })
    }
});

module.exports = router