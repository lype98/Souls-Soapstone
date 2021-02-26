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
        await db.query(`SELECT type,id FROM templates`, (error,results,fields) => {
            if (error) throw error;
            if(allMessages[0].length <= 0){                
                for (obj of results) { // get all the templates and put in allMessages index 0 array
                    const val = Object.values(obj);                    
                    allMessages[0].push(val);
                };
            };
        });
        await db.query(`SELECT type,id FROM conjunctions`, (error,results,fields) => {
            if (error) throw error;
            if(allMessages[1].length <= 0){
                for (obj of results) { // get all the conjunctions and put in allMessages index 1 array
                    const val = Object.values(obj);
                    allMessages[1].push(val);
                };
            };
        });
        await db.query(`SELECT * FROM words`, (error,results,fields) => {
            if (error) throw error;
            if(allMessages[2].actions.length <= 0){
                const wordArray = results;                
                wordArray.map((obj)=>{
                    if (obj.type == 1) allMessages[2].creatures.push([obj.word,obj.id]); 
                    if (obj.type == 2) allMessages[2].objects.push([obj.word,obj.id]);                   
                    if (obj.type == 3) allMessages[2].techniques.push([obj.word,obj.id]);                   
                    if (obj.type == 4) allMessages[2].actions.push([obj.word,obj.id]);                   
                    if (obj.type == 5) allMessages[2].geography.push([obj.word,obj.id]);                   
                    if (obj.type == 6) allMessages[2].orientation.push([obj.word,obj.id]);                   
                    if (obj.type == 7) allMessages[2].bodyparts.push([obj.word,obj.id]);                   
                    if (obj.type == 8) allMessages[2].attribute.push([obj.word,obj.id]);                   
                    if (obj.type == 9) allMessages[2].concepts.push([obj.word,obj.id]);                   
                    if (obj.type == 10) allMessages[2].musings.push([obj.word,obj.id]);                   
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
    let soapstone = req.body;    
    let soapstonePath = Math.floor(Math.random() * 99999); // create a random path number for a URL

    const verifySoapstone = ()=> { // verification function to make sure a valid soapstone was submitted
        if(Object.keys(soapstone).length === 2) { // if it's a message with 1 template
            if(Number.isInteger(soapstone.template1) && soapstone.template1 >= 1 && soapstone.template1 <= 17 && // if template1 is number and between 1 to 17
               Number.isInteger(soapstone.word1) && soapstone.word1 >= 1 && soapstone.word1 <= 323) { // if word1 is number and between 1 to 323
               return createSoapstone(false);
            } else console.error("Invalid Soapstone: Received Illegal 1 template soapstone", JSON.stringify(soapstone)); return res.status(403).send('forbidden'); // if not valid
        }
        if(Object.keys(soapstone).length === 5){ // if it's a message with 2 templates
            if(Number.isInteger(soapstone.template1) && soapstone.template1 >= 1 && soapstone.template1 <= 17 && // if template1 is number and between 1 to 17
               Number.isInteger(soapstone.word1) && soapstone.word1 >= 1 && soapstone.word1 <= 323 && // if word1 is number and between 1 to 323
               Number.isInteger(soapstone.conjunction) && soapstone.conjunction >= 1 && soapstone.conjunction <= 10 && // if conjunction is number and between 1 to 10
               Number.isInteger(soapstone.template2) && soapstone.template2 >= 1 && soapstone.template2 <= 17 && // if template2 is number and between 1 to 17
               Number.isInteger(soapstone.word2) && soapstone.word2 >= 1 && soapstone.word2 <= 323) { // if word2 is number and between 1 to 323
              return createSoapstone(true);
            } else console.error("Invalid Soapstone: Received Illegal 2 template soapstone", JSON.stringify(soapstone)); return res.status(403).send('forbidden'); // if not valid
        } else console.error("Invalid Soapstone: Received something that isn't a 2 or 5 length object", JSON.stringify(soapstone)); return res.status(403).send('forbidden');
    };

    const createSoapstone = async (hasConjunction)=>{        
        if(hasConjunction === false){ // if no conjunction, query template+word, fill it with replace() and sendtoDB()
            db.query(`SELECT type FROM templates WHERE id= ? UNION SELECT word FROM words WHERE id= ?`, [soapstone.template1,soapstone.word1] , (error,results,fields) => {
                if (error) {
                    console.error(error);
                    return res.status(404).send('Not Found: Problem with database');
                }
                const fillTemplate = results[0].type.replace("****", results[1].type);
                soapstone.message = `${fillTemplate}`; // add the formed message to the soapstone variable
                return checkBeforeSend(); // run function that checks for duplicate messages or paths before sending to DB
            });   
        }
        if(hasConjunction === true){ // if conjunction, query all IDs, fill templates with replace(), add all together and sendtoDB()
            db.query(`SELECT type FROM templates WHERE id= ? UNION ALL SELECT word as 'type' FROM words WHERE id= ?
                      UNION ALL SELECT type FROM conjunctions WHERE id= ?
                      UNION ALL SELECT type FROM templates WHERE id= ? UNION ALL SELECT word as 'type' FROM words WHERE id= ?`, 
                      [soapstone.template1,soapstone.word1,soapstone.conjunction,soapstone.template2,soapstone.word2] , (error,results,fields) => {
                if (error) {
                    console.error(error);
                    return res.status(404).send('Not Found: Problem with database');
                }         
                const fillTemplate1 = results[0].type.replace("****", results[1].type);
                const fillTemplate2 = results[3].type.replace("****", results[4].type);
                soapstone.message = `${fillTemplate1} ${results[2].type} ${fillTemplate2}`; // add the formed message to the soapstone variable
                return checkBeforeSend(); // run function that checks for duplicate messages or paths before sending to DB
            }); 
        }
    };    

    const checkBeforeSend = ()=> { // query db, check if there is a repeated message. if there is, ask user if they want to visit the link, else, check path            
        db.query(`SELECT message,path FROM soapstones`, (error,results,fields) => {
        if (error) {
            console.error(error);
            return res.status(404).send('Not Found: Problem with database');
        }
        const sendToDB = ()=> { // function to send the soapstone to the DB            
            // db.query(`INSERT INTO soapstones (message,path) VALUES ("${soapstone.message}","${soapstonePath}");`, (error,results,fields) => {
            db.query(`INSERT INTO soapstones (message,path) VALUES (?,?)`,[soapstone.message,soapstonePath], (error,results,fields) => {
                if (error) {
                    console.error(error);
                    return res.status(404).send('Not Found: Problem with database');
                }  
            });
            let soapstoneSent = { pathSent: soapstonePath };
            res.status(201).json(soapstoneSent);            
            return console.log(`sending to DB: ${soapstone.message}`);
        };

        let current = 0;
        for (result of results) {
            current++;            
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
    };
    verifySoapstone(); // run the verification function


});

router.post('/appraised', (req, res)=> {
    const vote = req.body;
    if(vote.appraise == true && vote.path.toString().length <= 5 && Number.isInteger(vote.path)) { //check if voted, and if it's a number smaller than 5 digits        
        db.query(`UPDATE soapstones SET good = good + 1 WHERE (path = ?)`,[vote.path], (error,results,fields) => {            
            if(results.changedRows == 1) {
                console.log(`Message with path ${vote.path} was appraised!`); // change later so it shows the message again, using the decoder I'll make
                res.status(200).send("ok");
            }
            if(error) return console.error(error);
        })
    };
});

router.post('/disparged', (req, res)=> {
    const vote = req.body;
    if(vote.disparge == true && vote.path.toString().length <= 5 && Number.isInteger(vote.path)) { //check if voted, and if it's a number smaller than 5 digits       
        db.query(`UPDATE soapstones SET poor = poor + 1 WHERE (path = ?)`,[vote.path], (error,results,fields) => {
            if(results.changedRows == 1) {
                console.log(`Message with path ${vote.path} was disparged!`); // change later so it shows the message again, using the decoder I'll make
                res.status(200).send("ok");
            }             
            if(error) return console.error(error);
        })
    }
});

module.exports = router