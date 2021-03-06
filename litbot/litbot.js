const express = require('express');
const bodyParser = require('body-parser');
const rita = require('rita');
const fs = require('fs');

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", `${PORT}`);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let paradiseLostSentences = "";

const getParadiseLost = () =>{
  try {
    return fs.readFileSync('./paradise-lost.txt', 'utf8');
  } catch (err) {
    return err;
  }
}


app.get('/', (req, res) => {
    res.send(paradiseLostSentences).status(200);

});



app.listen(PORT, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  paradiseLostSentences = getParadiseLost();

  paradiseLost = paradiseLostSentences.replace(/\\n/g, '');

  rita.tokenize(paradiseLost);
  rita.splitSentences(paradiseLost);
  let rm = new rita.RiMarkov(3);
  rm.loadText(paradiseLost);
  paradiseLostSentences = rm.generateSentences(1);
});