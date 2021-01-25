const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$('#ds3Flag').addEventListener('click', (e)=> {
    window.location.href = "/ds3";   
});

const handlers = {
    addDS3miniTemplate: ()=> {
        const DS3Template = templates.content.querySelector(".DS3Template"); // select the DS3 template in the <template>        
        $("#miniTemplates").innerHTML += DS3Template.outerHTML; // add template element to the templates container
        const lastMiniTemplate = document.querySelector('.DS3Template:last-child'); // select last template
        const $lastMiniTemplate = lastMiniTemplate.querySelector.bind(lastMiniTemplate); // shortcut for lastMiniTemplate query selection        
        const appraisals = soapstone.good-soapstone.poor;
        $lastMiniTemplate(".DS3Message").innerHTML = soapstone.message; // add text to last template message        
        $lastMiniTemplate(".DS3Rating").innerHTML = appraisals; // add text to last template rating
        lastMiniTemplate.setAttribute('id', soapstone.path);
        if(appraisals == 0) {return;} // skip this template as next lines are just for appraised/disparged soapstones
        if($lastMiniTemplate(".DS3Rating").innerHTML > 0){
            $lastMiniTemplate(".DS3Rating").classList.add('ratedGood');            
        }
        if($lastMiniTemplate(".DS3Rating").innerHTML < 0){
            $lastMiniTemplate(".DS3Rating").classList.add('ratedPoor');            
        }
        if(appraisals > 100 && appraisals <= 200){
            $lastMiniTemplate('.DS3Medalion').setAttribute("src","/assets-ds3/rank2.png");  
        }
        if(appraisals > 200 && appraisals <= 300){
            $lastMiniTemplate('.DS3Medalion').setAttribute("src","/assets-ds3/rank3.png");
        }
        if(appraisals > 300 && appraisals <= 500){
            $lastMiniTemplate('.DS3Medalion').setAttribute("src","/assets-ds3/rank4.png");
        }
        if(appraisals > 500){
            $lastMiniTemplate('.DS3Medalion').setAttribute("src","/assets-ds3/rank5.png");
        }
    },
};

(()=>{
    for(soapstone of soapstones){
        const templates = $("#templates");
        handlers.addDS3miniTemplate(); // in the future this should check what each template object is tagged as e.g. DeS or DS2        
    }
    $('#miniTemplates').addEventListener('click', (e)=> {        
        if(e.target.offsetParent.className.includes('DS3')){
            window.location.href = `/ds3/${e.target.offsetParent.id}`;
        }
    });
})();

// // maybe use this for going to next page in the main page
// $("#testAJAX").addEventListener('click', (e)=> {
//     let soapstone = {message:'test'}
//     var xhr = new window.XMLHttpRequest();
//     xhr.open('POST', '/ajax', true);
//     xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//     xhr.send(JSON.stringify(soapstone));
//     xhr.onreadystatechange = ()=>{
//         console.log(xhr.response)
//     }
// });