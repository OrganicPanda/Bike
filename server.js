var express = require('express')
  , db = require('./db')
  , app = express();

app.get('/api/bikes', function(req, res) {
  db.bikes.find(function (err, bikes) {
    if (err) throw err;

    res.json(bikes);
  });
});

app.use('/vendor', express.static(__dirname + '/vendor'));
app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 3000);