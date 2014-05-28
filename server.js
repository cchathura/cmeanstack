var express = require('express'),
    path = require('path'),
    http = require('http'),
    car = require('./routes/cars');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/cars', car.findAll);
app.get('/cars/:id', car.findById);
app.delete('/cars/:id', car.deleteCar);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
