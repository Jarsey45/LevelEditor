//zmienne, stałe

const express = require("express")
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser')
const PORT = 3000;
const path = require("path");
var map = {
  "size": "3",
  "level": [{
      "id": "0",
      "x": "0",
      "z": "0",
      "arrowOut": "2",
      "arrowIn": 2,
      "type": "gold",
      "odd": "1"
    },
    {
      "id": "3",
      "x": "1",
      "z": "0",
      "arrowOut": 2,
      "arrowIn": "5",
      "type": "light",
      "odd": "0"
    },
    {
      "id": "7",
      "x": "2",
      "z": "1",
      "arrowOut": "3",
      "arrowIn": 5,
      "type": "wall",
      "odd": "1"
    },
    {
      "id": "8",
      "x": "2",
      "z": "2",
      "arrowOut": "4",
      "arrowIn": 0,
      "type": "light",
      "odd": "1"
    },
    {
      "id": "5",
      "x": "1",
      "z": "2",
      "arrowOut": "5",
      "arrowIn": 1,
      "type": "wall",
      "odd": "0"
    },
    {
      "id": "2",
      "x": "0",
      "z": "2",
      "arrowOut": "0",
      "arrowIn": 2,
      "type": "gold",
      "odd": "1"
    }
  ]
};



app.use(express.static('static')) // serwuje stronę index.html
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));



app.get("/", function (req, res) {
  fs.readdir('/', function (err, files) {
    if (err) {
      return console.log(err);
    }
    console.log(files)
    res.send(files)
  });

})


app.post('/save', function (req, res) {
  map = req.body;
  //console.log(map)
})

app.post('/load', function (req, res) {
  res.end(JSON.stringify(map));
})








//otwieranie serwera na porcie
app.listen(PORT, () => {
  console.log("Start serwera na porcie: " + PORT)
})