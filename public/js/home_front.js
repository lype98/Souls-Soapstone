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
            handler.refreshTemplate();
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
        $('#conjunction').style.display = "inline";
        secondTemplate.style.display = "inline";
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
        handler.populateWord();
    }
    else  {
        elWord.innerHTML = '';
        handler.populateWord();
    }
});

elWord.addEventListener('click', (e)=> {
    if(elWord.value) {
        firstWord = elWord.value;        
        firstTemplate.innerHTML = currentTemplate;
        handler.refreshTemplate();
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
            handler.refreshTemplate2();
        }        
    }
});
/** ------------------------- words 2 ------------------------- */
const elWord2 = $('#word2');
const elType2 = $('#type2');

elType2.addEventListener('click', (e)=> { // click listener to populate the word box
    if(elType2.value && elWord2.length == 0) {
        handler.populateWord2();
    }
    else  {
        elWord2.innerHTML = '';
        handler.populateWord2();
    }
});

elWord2.addEventListener('click', (e)=> {
    if(elWord2.value) {
        secondWord = elWord2.value;        
        secondTemplate.innerHTML = currentTemplate2;
        handler.refreshTemplate2();
    }
});
/** ------------------------- handlers ------------------------- */
let handler = {
    populateWord: ()=> { // populates the word box with selected type
        let type = elType.value;
        words[type].forEach(word => {
            const elOption = document.createElement('option');
            elOption.value = word;
            elOption.innerHTML = word;
            elWord.appendChild(elOption);                        
        });    
    },
    populateWord2: ()=> { // populates the word box with selected type
        let type = elType2.value;
        words[type].forEach(word => {
            const elOption = document.createElement('option');
            elOption.value = word;
            elOption.innerHTML = word;
            elWord2.appendChild(elOption);                        
        });    
    },
    refreshTemplate: ()=>{firstTemplate.innerHTML = firstTemplate.innerHTML.replace("****", firstWord);},
    refreshTemplate2: ()=>{secondTemplate.innerHTML = secondTemplate.innerHTML.replace("****", secondWord);}
};



