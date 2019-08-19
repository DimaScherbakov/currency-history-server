// server.js

const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var currencyPairSchema = new mongoose.Schema({
  name: String,
  rates: Array
});
var currencyPair = mongoose.model('currencyPair', currencyPairSchema);
mongoose
  .connect('mongodb://127.0.0.1:27017/currencyHistoryDB', {
    useNewUrlParser: true
  })
  .then(
    () => {
      console.log('Database is connected');
    },
    err => {
      console.log('Can not connect to the database' + err);
    }
  );

const app = express();
app.use(bodyParser.json());
app.use('*', cors());

app.get('/:name', function(req, res) {
  currencyPair.find({ name: req.params.name }, function(err, currency) {
    if (err) {
      console.log(err);
      res.status(404).send(err);
    } else {
      console.log(currency);
      res.send(currency);
    }
  });
});

app.post('/', function(req, res) {
  var pair = new currencyPair({ name: req.body.name, rates: req.body.rates });
  currencyPair
    .find({ name: req.body.name })
    .remove()
    .exec();
  pair.save(function(err, pair) {
    if (err) return console.error(err);
  });
});
const port = process.env.PORT || 4000;

const server = app.listen(port, function() {
  console.log('Listening on port ' + port);
});
