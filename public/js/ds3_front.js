const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const templates = allMessages[0];
const conjunctions = allMessages[1];
const words = allMessages[2];


/** ------------------------- template1 ------------------------- */
const firstTemplate = $('#firstTemplate');
let firstWord;
let currentTemplate;

(()=>{
    firstTemplate.innerHTML = templates[Math.floor(Math.random() * templates.length)]; // chooses random template as starter + adds it to currentTemplate
    currentTemplate = firstTemplate.innerHTML;
})();

$('#tDefault').innerHTML = $('#firstTemplate').innerText; // populates the default text in the templates box
const elTemplateBox = $('#templateBox');
(()=> {
    templates.forEach(template => {  // populates the templates box       
        const elOption = document.createElement('option');
        elOption.value = template;
        elOption.innerHTML = template;
        elTemplateBox.appendChild(elOption);
    });
})();

elTemplateBox.addEventListener('click', (e)=> { // click listener to change the main template
    if(elTemplateBox.value) {
        currentTemplate = elTemplateBox.value;        
        if(firstWord === undefined) {
            firstTemplate.innerHTML = e.target.value;
        } else {
            firstTemplate.innerHTML = e.target.value;
            handler.refreshTemplate(firstTemplate,firstWord);
        }        
    }
});
/** ------------------------- conjunctions ------------------------- */
const mainConjunction = $('#conjunction');
mainConjunction.innerHTML = conjunctions[Math.floor(Math.random() * conjunctions.length)]; // chooses random conjunction as starter

$('#cDefault').innerHTML = $('#conjunction').innerText; // populates the default text in the conjunctions box
const elConjBox = $('#conjBox');
(()=> {
    conjunctions.forEach(conjuncion => {  // populates the conjunctions box   
        const elOption = document.createElement('option');
        elOption.value = conjuncion;
        elOption.innerHTML = conjuncion;
        elConjBox.appendChild(elOption);
    });
})();

elConjBox.addEventListener('click', (e)=> { // click listener to change the main template
    if(elConjBox.value) {
        mainConjunction.innerHTML = e.target.value;
    }
});

const elConjCheck = $('#conjCheck');
elConjCheck.addEventListener('click', (e)=> { // toggles conjunctions visibility
    if($('#conjCheck').checked == true) {
        $('#conjunction').style.display = "inline-block";
        secondTemplate.style.display = "inline-block";
        $('#conjRow').style.display = "flex";
    }
    if($('#conjCheck').checked == false) {        
        $('#conjunction').style.display = "none";
        secondTemplate.style.display = "none";
        $('#conjRow').style.display = "none";
    }
});
/** ------------------------- words ------------------------- */
const elTypeClass = $$('.type');
const elType = $('#type1');
const elWord = $('#word1');

elTypeClass.forEach(typeClass => {
    Object.keys(words).forEach(type => { // populate the types box
        const elOption = document.createElement('option');
        elOption.value = type;
        elOption.innerHTML = type;
        typeClass.appendChild(elOption);
    });
});
elType.addEventListener('click', (e)=> { // click listener to populate the word box
    if(elType.value && elWord.length == 0) {
        handler.populateWord(elType,elWord);
    }
    else  {
        elWord.innerHTML = '';
        handler.populateWord(elType,elWord);
    }
});

elWord.addEventListener('click', (e)=> { // click listener to select a word and refresh the template
    if(elWord.value) {
        firstWord = elWord.value;        
        firstTemplate.innerHTML = currentTemplate;
        handler.refreshTemplate(firstTemplate,firstWord);
    }
});
/** ------------------------- template 2 ------------------------- */
const secondTemplate = $('#secondTemplate');
let secondWord;
let currentTemplate2;

(()=>{
    secondTemplate.innerHTML = templates[Math.floor(Math.random() * templates.length)]; // chooses random template as starter + adds it to currentTemplate2
    currentTemplate2 = secondTemplate.innerHTML;
})();

$('#t2Default').innerHTML = $('#secondTemplate').innerText; // populates the default text in the templates box
const elTemplateBox2 = $('#templateBox2');
(()=> {
    templates.forEach(template => {  // populates the templates box       
        const elOption = document.createElement('option');
        elOption.value = template;
        elOption.innerHTML = template;
        elTemplateBox2.appendChild(elOption);
    });
})();

elTemplateBox2.addEventListener('click', (e)=> { // click listener to change the main template
    if(elTemplateBox2.value) {
        currentTemplate2 = elTemplateBox2.value;        
        if(secondWord === undefined) {
            secondTemplate.innerHTML = e.target.value;
        } else {
            secondTemplate.innerHTML = e.target.value;
            handler.refreshTemplate(secondTemplate,secondWord);
        }        
    }
});
/** ------------------------- words 2 ------------------------- */
const elWord2 = $('#word2');
const elType2 = $('#type2');

elType2.addEventListener('click', (e)=> { // click listener to populate the word box
    if(elType2.value && elWord2.length == 0) {
        handler.populateWord(elType2,elWord2);
    }
    else  {
        elWord2.innerHTML = '';
        handler.populateWord(elType2,elWord2);
    }
});

elWord2.addEventListener('click', (e)=> { // click listener to select a word and refresh the template
    if(elWord2.value) {
        secondWord = elWord2.value;        
        secondTemplate.innerHTML = currentTemplate2;
        handler.refreshTemplate(secondTemplate,secondWord);
    }
});
/** ------------------------- Submit ------------------------- */
const submitButton = $('#submitButton');

submitButton.addEventListener('click', async(e)=> {
    
    if(firstTemplate.innerText.includes('****')||secondTemplate.innerText.includes('****') && secondTemplate.style.display == "inline-block") { // if there are any visible gaps
        return handler.modalFillBlanks();
    }    
    else{
        const submissionID = Math.floor(Math.random() * 9999999999);
        // in case there are 2 templates
        if(secondTemplate.style.display == "inline-block"){
            let path = Math.floor(Math.random() * 99999); // create a random path number for a URL later on
            console.log(`message: ${firstTemplate.innerText} ${mainConjunction.innerText} ${secondTemplate.innerText} / path: ${path}`);            
            let soapstone = { // object to send to API
                message: `${firstTemplate.innerText} ${mainConjunction.innerText} ${secondTemplate.innerText}`,
                path: path,
                ID: submissionID
            }
            handler.checkSubmittedMessage(soapstone);
        }
        else{ // in case there is one template
            let path = Math.floor(Math.random() * 99999); // create a random path number for a URL later on
            console.log(`message: ${firstTemplate.innerText} / path: ${path}`);
            let soapstone = { // object to send to API
                message: firstTemplate.innerText,
                path: path,
                ID: submissionID
            };
            handler.checkSubmittedMessage(soapstone);                             
        }
    };
});
/** ------------------------- coiled sword ------------------------- */
$('#returnHomepage').addEventListener('click', (e)=> {
    window.location.href = '/';
});
/** ------------------------- modals ------------------------- */
var modalRedirectEl = document.getElementById('modalRedirect')
modalRedirectEl.addEventListener('hide.bs.modal', function (event) {
    location.reload();
})
/** ------------------------- handlers ------------------------- */
const handler = {
    populateWord: (elType,elWord)=> { // populates the word box with selected type
        let type = elType.value;
        words[type].forEach(word => {
            const elOption = document.createElement('option');
            elOption.value = word;
            elOption.innerHTML = word;
            elWord.appendChild(elOption);                        
        });    
    },
    refreshTemplate: (templateEl,wordEl)=>{templateEl.innerHTML = templateEl.innerHTML.replace("****", wordEl);},
    modalFillBlanks: ()=>{
        var modalFillBlanks = new bootstrap.Modal(document.getElementById('modalFillBlanks'));
        modalFillBlanks.show();},
    modalRedirect: ()=>{
        var modalRedirect = new bootstrap.Modal(document.getElementById('modalRedirect'));
        modalRedirect.show();
    },
    checkSubmittedMessage: (obj)=> {
        let xhr = new window.XMLHttpRequest(); // AJAX POST request to /ds3/submitted_soapstone to send soapstone object
        xhr.open('POST', '/ds3/submitted_soapstone', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(obj));
        xhr.onreadystatechange = ()=> {
          if (xhr.readyState === 4) {
              // check if response message is already in the database
              let response = JSON.parse(xhr.response);
              if(response.messageExists === $('#mainTemplate').innerText){
                  handler.modalRedirect();
                  return $('#modalRedirectButton').addEventListener('click', (e)=> {
                      window.location.href=`/ds3/${response.pathExists}`;
                  });
              };
              // check if response message got sent to the database
              if(response.messageSent === $('#mainTemplate').innerText){
                  window.location.href=`/ds3/${response.pathSent}`
              };                      
          }
        }
    },
};



