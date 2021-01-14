const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

if(soapstone.good > soapstone.bad) {
    $('.rating').innerText = 'Rated Good';
    $('.rating').classList.add('ratedGood');
}
if(soapstone.bad > soapstone.good) {
    $('.rating').innerText = 'Rated Poor';
    $('.rating').classList.add('ratedBad');
}