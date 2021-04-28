const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const main = require('./route/index');
const board = require('./route/board');

const app = express();

app.set('view engine', 'html');
nunjucks.configure('views',{
    express:app,
});

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('static'));

app.use('/',main);
app.use('/board',board);

app.listen(5000,()=>{
    console.log('port open 5000');
})
