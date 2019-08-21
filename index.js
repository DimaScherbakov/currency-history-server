// server.js

const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var rateSchema = new mongoose.Schema({
  date: String,
  value: Number,
  _id: false,
  min: { type: Boolean, required: false },
  max: { type: Boolean, required: false }
});
var currencyPairSchema = new mongoose.Schema({
  name: { type: String },
  rates: [rateSchema]
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
app.use(bodyParser.json({ limit: '50mb' }));

app.use('*', cors());

app.get('/:name', function(req, res) {
  currencyPair.findOne({ name: req.params.name }, function(err, currency) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(currency);
    }
  });
});
app.post('/:name', function(req, res) {
  var pair = new currencyPair({ name: req.params.name });
  for (i in req.body) {
    pair.rates.push(req.body[i]);
  }
  currencyPair.remove({ name: req.params.name }, () => {});
  pair.save(function(err, item) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send('item saved to database');
    }
  });
});
const port = process.env.PORT || 4000;

const server = app.listen(port, function() {
  console.log('Listening on port ' + port);
});
