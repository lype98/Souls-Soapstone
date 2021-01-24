const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$('#ds3Flag').addEventListener('click', (e)=> {
    window.location.href = "/ds3";   
});

const handlers = {
    addDS3miniTemplate: ()=> {
        const DS3Template = templates.content.querySelector(".DS3Template"); // select the DS3 template in the <template>
        const appraisals = soapstone.good-soapstone.poor;
        $("#miniTemplates").innerHTML += DS3Template.outerHTML; // add template element to the templates container
        const lastMiniTemplate = document.querySelector('.DS3Template:last-child'); // select last template
        const $lastMiniTemplate = lastMiniTemplate.querySelector.bind(lastMiniTemplate); // shortcut for lastMiniTemplate query selection        
        $lastMiniTemplate(".DS3Message").innerHTML = soapstone.message; // add text to last template message        
        $lastMiniTemplate(".DS3Rating").innerHTML = appraisals; // add text to last template rating
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
})();

