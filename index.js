const express = require('express');
const home = require('./routes/home');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/css', express.static(__dirname + 'public/css'))
app.set('view engine', 'ejs'); 

app.use('/', home);



app.listen('3000', () => {
    console.log('Server started on port 3000')
});

