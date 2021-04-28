const express = require('express');
const router = express.Router();
const sql = require('../dbconn.js');

router.get('/list',(req,res)=>{
    sql((err,connection)=>{
        if(err) throw err;
        connection.query("select idx, subject, board_name,content, date_format(today, '%Y-%m-%d') as today, hit from board order by idx desc",(error,results)=>{
            if(error){
                console.log(error);
            }else{
                let total = results.length;
                results.forEach(ele=>{
                    ele.number = total;
                    total--;
                });

                res.render('./board/list.html',{
                    list : results,
                });
            }
        });
        connection.release();
    });
});

router.get('/write',(req,res)=>{
    res.render('./board/write.html');
});

router.post('/write',(req,res)=>{
    sql((err,connection)=>{
        if(err) throw err;
        connection.query(`INSERT INTO board (subject, board_name, content, hit) VALUES('${req.body.subject}','${req.body.board_name}','${req.body.content}',0);`,(error,results)=>{
            if(error){
                console.log(error);
            }else{
                //console.log(results);
                res.redirect(`./view?idx=${results.insertId}`);
            }
        });
        connection.release();
    });
});


router.get('/view',(req,res)=>{
    sql((err,connection)=>{
        if(err) throw err;
        connection.query(`UPDATE board SET hit=hit+1 WHERE idx = ${req.query.idx}`,(error,results)=>{
            if(error){
                console.log(error);
            }else{

            }
            connection.release();
        });
    });

    sql((err,connection)=>{
        if(err) throw err;
        connection.query(`SELECT * FROM board WHERE idx=${req.query.idx}`,(error,results)=>{
            if(error){
                console.log(error);
            }else{
                res.render('./board/view.html',{
                    list : results,
                });
            }
        });
        connection.release();
    });
});

router.get('/modify',(req,res)=>{
    sql((err,connection)=>{
        if(err) throw err;
        connection.query(`SELECT * FROM board WHERE idx=${req.query.idx}`,(error,results)=>{
            if(error){
                console.log(error);
            }else{
                res.render('./board/modify.html',{
                    list : results,
                });
            }
        });
        connection.release();
    });
});
router.post('/modify',(req,res)=>{
    sql((err,connection)=>{
        if(err) throw err;
        connection.query(`UPDATE board SET subject = '${req.body.subject}', board_name='${req.body.board_name}', content='${req.body.content}' WHERE idx = ${req.query.idx};`,(error,results)=>{
            if(error){
                console.log(error);
            }else{
                res.redirect(`./view?idx=${req.query.idx}`);
            }
        });
        connection.release();
    });
});

router.get('/delete',(req,res)=>{
    sql((err,connection)=>{
        if(err) throw err;
        connection.query(`DELETE FROM board WHERE idx=${req.query.idx};`,(error,results)=>{
            if(error){
                console.log(error);
            }else{
                res.redirect('/board/list');
            }
        });
        connection.release();
    });
});


module.exports = router;