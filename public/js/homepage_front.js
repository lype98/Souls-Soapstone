const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let currentPage = {id:0};
let searchPage = 0;

$('#ds3Flag').addEventListener('click', (e)=> {
    window.location.href = "/ds3";   
});

const handlers = {
    loadTemplates: (array)=> {
        for(soapstone of array){ // in the future this should check what each template object is tagged as e.g. DeS or DS2       
            handlers.addDS3miniTemplate();       
        }
    },
    separateSearchArray: (bigArray)=> {
        let size = 12; let arrayOfArrays = [];
        for (let i=0; i<bigArray.length; i+=size) {
             arrayOfArrays.push(bigArray.slice(i,i+size));
        };
        searchArray = arrayOfArrays;
    },
    arrowSearchMode: ()=> { 
        $("#rightArrow").removeEventListener('click',rightArrow);
        $("#leftArrow").removeEventListener('click',leftArrow);   
        $("#rightArrow").addEventListener('click', rightArrowSearch);
        $("#leftArrow").addEventListener('click', leftArrowSearch);
    },
    arrowNormalMode: ()=> { 
        $("#rightArrow").removeEventListener('click',rightArrowSearch);
        $("#leftArrow").removeEventListener('click',leftArrowSearch);   
        $("#rightArrow").addEventListener('click', rightArrow);
        $("#leftArrow").addEventListener('click', leftArrow);
    },
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

(()=>{ // function that will run on page load that displays the first page of mini templates and sets a redirect click event
    handlers.loadTemplates(soapstones);
    $('#miniTemplates').addEventListener('click', (e)=> {        
        if(e.target.offsetParent.className.includes('DS3')){
            window.location.href = `/ds3/${e.target.offsetParent.id}`;
        }
    });
})();
/* ---------------------------------- page arrows normal mode ---------------------------------- */
let rightArrow = (e)=> {
    if($('#miniTemplates').children.length === 12) {
        var xhr = new window.XMLHttpRequest();
        xhr.open('POST', '/right_arrow', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(currentPage));
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState === 4) {            
                $('#miniTemplates').innerHTML = ''; // clear container for refresh
                handlers.loadTemplates((JSON.parse(xhr.response))); // Load page                
                if((JSON.parse(xhr.response)).length > 0) currentPage.id++; // prevent page incrementation at the end of the database
            }
          }
    };
};
let leftArrow = (e)=> {
    if(currentPage.id >= 1) {        
        var xhr = new window.XMLHttpRequest();
        xhr.open('POST', '/left_arrow', true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');    
        xhr.send(JSON.stringify(currentPage));
        xhr.onreadystatechange = ()=> {
            if (xhr.readyState === 4) {
                $('#miniTemplates').innerHTML = ''; // clear container for refresh                
                handlers.loadTemplates((JSON.parse(xhr.response))); // Load page
                if(currentPage.id > 0) currentPage.id--;            
            }
          }
    };
};
$("#rightArrow").addEventListener('click', rightArrow);
$("#leftArrow").addEventListener('click', leftArrow);
/* ---------------------------------- page arrows search mode ---------------------------------- */
let rightArrowSearch = (e)=> {
    if(searchArray.length-1 !== searchPage) {
        searchPage++;
        $('#miniTemplates').innerHTML = ''; // clear container for refresh
        handlers.loadTemplates(searchArray[searchPage]); // Load search array templates index+1
    };
}
let leftArrowSearch = (e)=> {
    if(searchPage !== 0) {
        searchPage--;
        $('#miniTemplates').innerHTML = ''; // clear container for refresh
        handlers.loadTemplates(searchArray[searchPage]); // Load search array templates index+1
    };
}
/* ---------------------------------- search bar ---------------------------------- */  
let typingTimer;
let searchArray;
//on keyup, start the countdown
$('#search').addEventListener('keyup', ()=> {
  clearTimeout(typingTimer);
  typingTimer = setTimeout( ()=> {
    if($('#search').value) { // check if search bar is not empty
      let searchQuery = {query: $('#search').value};      
      let xhr = new window.XMLHttpRequest();
      xhr.open('POST', '/search_bar', true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');    
      xhr.send(JSON.stringify(searchQuery));

      xhr.onreadystatechange = ()=> {
        if (xhr.readyState === 4) {
            handlers.separateSearchArray(JSON.parse(xhr.response));
            console.log('search array: ', searchArray);
            $('#miniTemplates').innerHTML = ''; // clear mini templates container for refresh
            handlers.loadTemplates(searchArray[0]);
            handlers.arrowSearchMode();// change arrows to search mode
        }          
      }
    } else {
        // change back to normal mode as if clean refresh
        $('#miniTemplates').innerHTML = ''; // clear mini templates container for refresh
        handlers.loadTemplates(soapstones);
        currentPage.id = 0; // reset page indexes
        searchPage = 0;
        handlers.arrowNormalMode();
    };
  }, 1000);
});
//on keydown, clear the countdown 
$('#search').addEventListener('keydown', ()=> {
  clearTimeout(typingTimer);
});

