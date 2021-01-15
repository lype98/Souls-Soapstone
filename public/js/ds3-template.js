const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

if(soapstone.good > soapstone.poor) {
    $('.rating').innerText = 'Rated Good';
    $('.rating').classList.add('ratedGood');
}
if(soapstone.poor > soapstone.good) {
    $('.rating').innerText = 'Rated Poor';
    $('.rating').classList.add('ratedPoor');
}

const appraiseButton = $('#appraiseButton');
const dispargeButton = $('#dispargeButton');

const appraiseAjax = (e)=> {
    const appraise = {
        appraise: true,
        message: soapstone.message
    };
    var xhr = new window.XMLHttpRequest(); // AJAX POST request to /ds3/appraised to send the vote
    xhr.open('POST', '/ds3/appraised', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(appraise));    
    $('#appraiseButton').classList.add('fade-out-bck','unselectable');
    $('#dispargeButton').classList.add('fade-out-bck','unselectable');    
    appraiseButton.removeEventListener('click', appraiseAjax);
    dispargeButton.removeEventListener('click', dispargeAjax);
    $('#votes').innerText = $('#votes').innerText.replace(soapstone.good, soapstone.good+1);
    $('#appraisals').innerText = $('#appraisals').innerText.replace(soapstone.good-soapstone.poor, soapstone.good-soapstone.poor+1);
};
appraiseButton.addEventListener('click', appraiseAjax)

const dispargeAjax = (e)=> {
    const disparge = {
        disparge: true,
        message: soapstone.message
    };
    var xhr = new window.XMLHttpRequest(); // AJAX POST request to /ds3/disparged to send the vote
    xhr.open('POST', '/ds3/disparged', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify(disparge));    
    $('#appraiseButton').classList.add('fade-out-bck','unselectable');
    $('#dispargeButton').classList.add('fade-out-bck','unselectable'); 
    appraiseButton.removeEventListener('click', appraiseAjax);
    dispargeButton.removeEventListener('click', dispargeAjax);
    $('#votes').innerText = $('#votes').innerText.replace(soapstone.poor, soapstone.poor+1);
    $('#appraisals').innerText = $('#appraisals').innerText.replace(soapstone.good-soapstone.poor, soapstone.good-soapstone.poor-1);
};
dispargeButton.addEventListener('click', dispargeAjax)

