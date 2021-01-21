const express = require('express');
const ds3 = require('./routes/ds3');
const homepage = require('./routes/homepage');
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.json());
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist')); //enable bootstrap
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/css', express.static(__dirname + 'public/css'))
app.set('view engine', 'ejs'); 

app.use('/ds3', ds3);
app.use('/', homepage);

app.listen('3000', () => {
    console.log('Server started on port 3000')
});

