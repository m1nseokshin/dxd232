const express = require("express");
const server = express();

// 정적 파일 서빙을 위한 미들웨어 설정
server.use(express.static(__dirname));

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log("The server is listening on port 3000");
});
