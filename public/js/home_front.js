const $ = document.querySelector.bind(document);
const templates = allMessages[0];
const conjunctions = allMessages[1];
const words = allMessages[2];


/** ------------------------- templates ------------------------- */
const firstTemplate = $('#firstTemplate');
let firstWord = undefined;
let currentTemplate = undefined;

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
    };
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
    };
});

const elConjCheck = $('#conjCheck');
elConjCheck.addEventListener('click', (e)=> { // toggles conjunctions visibility
    if($('#conjCheck').checked == true) {
        $('#conjBoxDiv').style.display = "inline"
        $('#conjunction').style.display = "inline"
    }
    if($('#conjCheck').checked == false) {
        $('#conjBoxDiv').style.display = "none"
        $('#conjunction').style.display = "none"
    }
});
/** ------------------------- words ------------------------- */
const elTypeClass = $('.type');
const elWordClass = $('.word');
Object.keys(words).forEach(type => { // populate the types box
    const elOption = document.createElement('option');
    elOption.value = type;
    elOption.innerHTML = type;
    elTypeClass.appendChild(elOption);
});

elTypeClass.addEventListener('click', (e)=> { // click listener to populate the word box
    if(elTypeClass.value && elWordClass.length == 0) {
        handler.populateWord();
    }
    else  {
        elWordClass.innerHTML = '';
        handler.populateWord();
    }
})

elWordClass.addEventListener('click', (e)=> {
    if(elWordClass.value) {
        firstWord = elWordClass.value;        
        firstTemplate.innerHTML = currentTemplate;
        handler.refreshTemplate();
    };
});







/** ------------------------- handlers ------------------------- */
let handler = {
    populateWord: ()=> { // populates the word box with selected type
        let type = elTypeClass.value;
        words[type].forEach(word => {
            const elOption = document.createElement('option');
            elOption.value = word;
            elOption.innerHTML = word;
            elWordClass.appendChild(elOption);                        
        });    
    },
    refreshTemplate: ()=>{firstTemplate.innerHTML = firstTemplate.innerHTML.replace("****", firstWord)}
}



