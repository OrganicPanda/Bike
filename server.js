var express = require('express');
var app = express();

app.use('/vendor', express.static(__dirname + '/vendor'));
app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 3000);