const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
})

app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static('public'));


let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'homepage',
});
connection.connect();


app.get('/', (req, res) => {
    res.render('index.html');
});


app.get('/list', (req, res) => {
    // 1. db 에 있는 homepage -> board 라는 테이블을 select문 활용해 내용을 콘솔로그에 찍기
    // 2. 콘솔로그 찍은 내용을 list.html 데이터를 넘겨보자 <- nunjucks로 할 수 있음
    // 3. nunjucks 구문 사용해서 받아온 데이터를 조작하는걸 해본다.
    connection.query("SELECT idx, subject, board_name, content, date_format(today,'%Y-%m-%d') as today, hit FROM board", (error, results) => {
        if (error) {
            console.log(error);
        } else {
            //console.log(results);
            res.render('list.html', {
                list: results,
            });
        }
    });
});


app.get('/write', (req, res) => {
    res.render('board_write.html');
});

app.post('/write', (req, res) => {
    //console.log(req.body);
    let title = req.body.board_subject;
    let name = req.body.board_name;
    let content = req.body.board_content;

    connection.query(`insert into board (subject, board_name,content,hit) values('${title}','${name}','${content}',0)`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/list');
        }
    })
});



app.get('/view', (req, res) => {
    // 조회수 hit 처리
    hit = parseInt(req.query.hit)+1 ;

    connection.query(`update board set hit=${hit} where idx=${req.query.idx}`, (error,results)=>{
        if (error) {
            console.log(error);
        } else {        
            //console.log(results);
        }
    });

    connection.query(`SELECT * FROM board WHERE idx=${req.query.idx};`, (error, results) => {
        if (error) {
            console.log(error);
        } else {        
            res.render('board_view.html', {
                list: results,
            });
        }
    });
});


app.get('/modify', (req, res) => {
    connection.query(`SELECT * FROM board WHERE idx=${req.query.idx};`, (error, results) => {
        if (error) {
            console.log(error);
        } else {        
            res.render('board_modify.html', {
                list: results,
            });
        }
    });
});
app.post('/modify', (req, res) => {
    /*
    db내용 처리하는 부분 
    해당 내용 업데이트 하는 부분

    지금 idx를 못받아옴 - let idx = req.query.idx;
    */
    let idx2 = req.query.idx;
    let title = req.body.board_subject;
    let name = req.body.board_name;
    let content = req.body.board_content;
    console.log(req.body);

    connection.query(`update board set subject='${title}', board_name='${name}', content='${content}' where idx=${idx2};`, (error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/list');
        }
    });
});


app.get('/delete',(req,res)=>{
    connection.query(`DELETE FROM board WHERE idx = '${req.query.idx}';`,(error,results)=>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/list');
        }
    });
});


app.listen(3000, () => {
    console.log("server open");
});