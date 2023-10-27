const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/commentSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Comment 모델 생성
const Comment = mongoose.model('Comment', {
  text: String
});

// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
