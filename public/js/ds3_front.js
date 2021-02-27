const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const templates = allMessages[0];
const conjunctions = allMessages[1];
const words = allMessages[2];

let currentIndexes = {
    template1: undefined,
    word1: undefined,
    conjunction: undefined,
    template2: undefined,
    word2: undefined
}
/** ------------------------- template1 ------------------------- */
const firstTemplate = $('#firstTemplate');
let firstWord;
let currentTemplate;

(()=>{
    rndmTemplate = Math.floor(Math.random() * templates.length);    
    firstTemplate.innerHTML = templates[rndmTemplate][0]; // chooses random template index 0 as starter + adds it to currentIndexes.template1
    currentTemplate = firstTemplate.innerHTML;
    currentIndexes.template1 = rndmTemplate+1;
})();

$('#tDefault').innerHTML = $('#firstTemplate').innerText; // populates the default text in the templates box
const elTemplateBox = $('#templateBox');
(()=> {
    templates.forEach(template => {  // populates the templates box               
        const elOption = document.createElement('option');
        elOption.value = template[0];
        elOption.innerHTML = template[0];
        elOption.id = template[1];
        elTemplateBox.appendChild(elOption);
    });
})();

elTemplateBox.addEventListener('touchstart click', (e)=> { // click listener to change the main template
    if(elTemplateBox.value) {
        currentTemplate = elTemplateBox.value; // update currentTemplate
        currentIndexes.template1 = elTemplateBox.selectedIndex; // update current template index
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

(()=>{
    rndmConj = Math.floor(Math.random() * conjunctions.length);
    mainConjunction.innerHTML = conjunctions[rndmConj][0]; // chooses random conjunction as starter
    currentIndexes.conjunction = rndmConj+1;
})();

$('#cDefault').innerHTML = $('#conjunction').innerText; // populates the default text in the conjunctions box
const elConjBox = $('#conjBox');
(()=> {
    conjunctions.forEach(conjuncion => {  // populates the conjunctions box   
        const elOption = document.createElement('option');
        elOption.value = conjuncion[0];
        elOption.innerHTML = conjuncion[0];
        elOption.id = conjuncion[1];
        elConjBox.appendChild(elOption);
    });
})();

elConjBox.addEventListener('touchstart click', (e)=> { // click listener to change the main template
    if(elConjBox.value) {
        mainConjunction.innerHTML = e.target.value;        
        if(e.target.id >= 1 && e.target.id <= 10){
            currentIndexes.conjunction = parseInt(e.target.id);            
        }
    }
});

const elConjCheck = $('#conjCheck');
elConjCheck.addEventListener('touchstart click', (e)=> { // toggles conjunctions visibility
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
elType.addEventListener('touchstart click', (e)=> { // click listener to populate the word box
    if(elType.value && elWord.length == 0) {
        handler.populateWord(elType,elWord);
    }
    else  {
        elWord.innerHTML = '';
        handler.populateWord(elType,elWord);
    }
});

elWord.addEventListener('touchstart click', (e)=> { // click listener to select a word and refresh the template
    if(elWord.value) {
        firstWord = elWord.value;        
        currentIndexes.word1 = parseInt(e.target.id);
        firstTemplate.innerHTML = currentTemplate;
        handler.refreshTemplate(firstTemplate,firstWord);
    }
});
/** ------------------------- template 2 ------------------------- */
const secondTemplate = $('#secondTemplate');
let secondWord;
let currentTemplate2;

(()=>{
    rndmTemplate = Math.floor(Math.random() * templates.length);
    secondTemplate.innerHTML = templates[rndmTemplate][0]; // chooses random template index 0 as starter + adds it to currentIndexes.template2 and currentTemplate2
    currentTemplate2 = secondTemplate.innerHTML;
    currentIndexes.template2 = rndmTemplate+1;
})();

$('#t2Default').innerHTML = $('#secondTemplate').innerText; // populates the default text in the templates box
const elTemplateBox2 = $('#templateBox2');
(()=> {
    templates.forEach(template => {  // populates the templates box       
        const elOption = document.createElement('option');
        elOption.value = template[0];
        elOption.innerHTML = template[0];
        elOption.id = template[1];
        elTemplateBox2.appendChild(elOption);
    });
})();

elTemplateBox2.addEventListener('touchstart click', (e)=> { // click listener to change the main template
    if(elTemplateBox2.value) {
        currentTemplate2 = elTemplateBox2.value; // update currentTemplate2
        currentIndexes.template2 = elTemplateBox2.selectedIndex; // update current template index        
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

elType2.addEventListener('touchstart click', (e)=> { // click listener to populate the word box
    if(elType2.value && elWord2.length == 0) {
        handler.populateWord(elType2,elWord2);
    }
    else  {
        elWord2.innerHTML = '';
        handler.populateWord(elType2,elWord2);
    }
});

elWord2.addEventListener('touchstart click', (e)=> { // click listener to select a word and refresh the template
    if(elWord2.value) {
        secondWord = elWord2.value;
        currentIndexes.word2 = parseInt(e.target.id);
        secondTemplate.innerHTML = currentTemplate2;
        handler.refreshTemplate(secondTemplate,secondWord);
    }
});
/** ------------------------- Submit ------------------------- */
const submitButton = $('#submitButton');

submitButton.addEventListener('touchstart click', async(e)=> {
    const matchString = (array,string,varIndex)=> {
        index++;        
        if(array[0] === string) {
            varIndex = index;
            return console.log(varIndex);
        }
    };  
    
    if(firstTemplate.innerText.includes('****')||secondTemplate.innerText.includes('****') && secondTemplate.style.display == "inline-block") { // if there are any visible gaps
        return handler.modalFillBlanks();
    }    
    else{        
        // in case there are 2 templates
        if(secondTemplate.style.display == "inline-block"){            
            console.log(`message: ${firstTemplate.innerText} ${mainConjunction.innerText} ${secondTemplate.innerText}`);            
            let soapstone = currentIndexes; // send currentIndexes object to back
            handler.checkSubmittedMessage(soapstone);
        }
        else{ // in case there is one template
            console.log(`message: ${firstTemplate.innerText}`);
            let soapstone = { // object to send to API
                template1: currentIndexes.template1,
                word1: currentIndexes.word1
            };
            handler.checkSubmittedMessage(soapstone);
        }
    };
});
/** ------------------------- coiled sword ------------------------- */
$('#returnHomepage').addEventListener('touchstart click', (e)=> {
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
            elOption.value = word[0];
            elOption.innerHTML = word[0];
            elOption.id = word[1];
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
              if(response.pathExists){
                  handler.modalRedirect();
                  return $('#modalRedirectButton').addEventListener('touchstart click', (e)=> {
                      window.location.href=`/ds3/${response.pathExists}`;
                  });
              };
              // check if response message got sent to the database
              if(response.pathSent){
                  window.location.href=`/ds3/${response.pathSent}`
              };                      
          }
        }
    },
};



