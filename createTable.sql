CREATE DATABASE homepage;
use homepage;

CREATE TABLE board(
    idx INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    board_name VARCHAR(50) NOT NULL,
    content TEXT,
    today DATETIME DEFAULT CURRENT_TIMESTAMP,
    hit INT(11)
) AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;

/*
maria db의 문법 맞지만
vscode가 sql문법이 아니라고 생각해서 나오는 오류

*/