const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

// CORS 설정
server.use(cors());

server.set('view engine', 'ejs');
server.set('views', __dirname + '/views');
server.use(express.static(__dirname));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json()); // JSON 파싱 미들웨어 추가

let comments = [];
const COMMENTS_FILE = __dirname + '/comments.json';

// Load previous comments data
fs.readFile(COMMENTS_FILE, (err, data) => {
  if (!err) {
    comments = JSON.parse(data);
  }
});

// Render the comment page
server.get("/", (req, res) => {
  res.render("index");
});

// JSON 파일로 댓글 데이터를 받는 엔드포인트
server.post("/add-comment", (req, res) => {
  const newComment = {
    id: comments.length + 1,
    text: req.body.text,
    userName: req.body.userName,
    time: req.body.time,
    voteUpCount: req.body.voteUpCount,
    voteDownCount: req.body.voteDownCount,
  };

  comments.push(newComment);

  // 새로운 댓글을 파일에 쓰는 함수 호출
  writeCommentsToFile(comments);

  // 클라이언트에 응답
  res.json(newComment);
});


// 댓글 데이터를 파일에 쓰는 함수
function writeCommentsToFile(data) {
  fs.writeFile(COMMENTS_FILE, JSON.stringify(data), (writeErr) => {
    if (writeErr) {
      console.error("댓글 파일에 쓰기 실패:", writeErr);
    } else {
      console.log("댓글 파일이 업데이트되었습니다.");
    }
  }
)}

server.put("/vote-up/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const comment = comments.find(comment => comment.id === commentId);

  if (comment) {
    comment.voteUpCount++; // 증가
    writeCommentsToFile(comments); // 파일 업데이트
    res.sendStatus(200);
  } else {
    res.status(404).send("댓글을 찾을 수 없습니다.");
  }
});

server.put("/vote-down/:commentId", (req, res) => {
  const commentId = parseInt(req.params.commentId, 10);
  const comment = comments.find(comment => comment.id === commentId);

  if (comment) {
    comment.voteDownCount++; // 증가
    writeCommentsToFile(comments); // 파일 업데이트
    res.sendStatus(200);
  } else {
    res.status(404).send("댓글을 찾을 수 없습니다.");
  }
});

// 서버 라우팅
server.get("/get-comments", (req, res) => {
  res.json(comments);
});

server.get("/about", (req, res) => {
  res.render("about");
});

server.get("/artworks", (req, res) => {
  res.render("artworks");
});

server.get("/dxdaward", (req, res) => {
  res.render("dxdaward");
});

// 연결
server.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log("서버가 포트 3000에서 실행 중입니다.");
});