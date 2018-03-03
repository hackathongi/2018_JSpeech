var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});